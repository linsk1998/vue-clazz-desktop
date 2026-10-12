const path = require('path');
const { rollup } = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const vue = require("@vitejs/plugin-vue");
const vueJsx = require("@vitejs/plugin-vue-jsx");
const progress = require('rollup-plugin-progress');
const babelPlugin = require("./babel");
const pkg = require("../package.json");

function external(id) {
	if(id in pkg.dependencies) {
		return true;
	}
	if(id in pkg.peerDependencies) {
		return true;
	}
	for(let key in pkg.dependencies) {
		if(id.startsWith(key + "/")) {
			return true;
		}
	}
	for(let key in pkg.peerDependencies) {
		if(id.startsWith(key + "/")) {
			return true;
		}
	}
	if(id.endsWith(".png")) {
		return true;
	}
	return false;
}

function createPlugins(babelOptions) {
	return [
		nodeResolve({
			extensions: ['.ts', '.tsx']
		}),
		{
			...vue(),
			enforce: "pre"
		},
		babelPlugin(babelOptions),
		(function() {
			let plugin = vueJsx({
				tsTransform: 'built-in',
				include: /\.(j|t)sx$/
			});
			plugin.transform.order = undefined;
			plugin.enforce = "pre";
			return plugin;
		})(),
		progress()
	];
}

function buildInputFromBundle(exportedBindings) {
	const input = {};
	for(const id in exportedBindings) {
		const exports = exportedBindings[id];
		for(const name of exports) {
			input[name] = id;
		}
	}
	return input;
}

async function buildAll(compilerOptions, outputOptions) {
	const exportedBindings = Object.create(null);
	const bundle = await rollup({
		input: 'src/index.ts',
		external,
		plugins: [
			...createPlugins(compilerOptions),
			{
				name: 'collect-exports',
				async moduleParsed(info) {
					if(info.isEntry) {
						for(const rel in info.exportedBindings) {
							const { id } = await this.resolve(rel, info.id);
							if(id in exportedBindings) {
								exportedBindings[id] = Array.from(new Set([
									...exportedBindings[id],
									...info.exportedBindings[rel]
								]));
							} else {
								exportedBindings[id] = info.exportedBindings[rel];
							}
						}
					}
				},
				generateBundle() {
					for(const id in exportedBindings) {
						const exports = exportedBindings[id];
						if(exports.includes("*")) {
							const info = this.getModuleInfo(id);
							exportedBindings[id] = info.exports;
						}
					}
				}
			}
		]
	});
	await bundle.write({
		sourcemap: false,
		freeze: false,
		interop: "esModule",
		esModule: true,
		format: "esm",
		...outputOptions
	});
	await bundle.close();

	return buildInputFromBundle(exportedBindings);
}

async function buildLib(input, compilerOptions, outputOptions) {
	const PREFIX = "\0export:";
	let entries = [];
	for(const id in input) {
		entries.push(PREFIX + id);
	}
	const bundle = await rollup({
		input: Object.keys(input),
		external,
		plugins: [
			{
				resolveId(id, importer) {
					if(!importer) return id;
				},
				load(id) {
					const info = this.getModuleInfo(id);
					if(info.isEntry) {
						const source = JSON.stringify(input[id]);
						return `export { ${id} } from ${source}; export { ${id} as default } from ${source};`;
					}
				}
			},
			...createPlugins(compilerOptions),
		]
	});
	await bundle.write({
		dir: "lib",
		sourcemap: false,
		hoistTransitiveImports: false,
		freeze: false,
		interop: "esModule",
		esModule: true,
		format: "esm",
		chunkFileNames(chunkInfo) {
			const id = input[chunkInfo.name];
			const name = path.basename(id, path.extname(id));

			return name + '/' + name + '-[hash].js';
		},
		...outputOptions,
	});
	await bundle.close();
}

async function main() {
	{
		let input = await buildAll({}, {
			file: "dist/ting-admin.js"
		});
		await buildLib(input, {}, {
			entryFileNames: '[name]/index.js'
		});
	}
	{
		let input = await buildAll({
			experimentalDecorators: true,
			useDefineForClassFields: false,
		}, {
			file: "dist/ting-admin.experimental.js"
		});
		await buildLib(input, {
			experimentalDecorators: true,
			useDefineForClassFields: false,
		}, {
			entryFileNames: '[name]/experimental.js'
		});
	}
	console.log('\n构建完成。');
}

main().catch(err => {
	console.error(err.stack || err);
	process.exit(1);
});
