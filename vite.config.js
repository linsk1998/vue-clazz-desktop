const path = require("path");
const inject = require("@rollup/plugin-inject");
const vue = require("@vitejs/plugin-vue");
const vueJsx = require("@vitejs/plugin-vue-jsx");
const mock = require("vite-plugin-mockjs-lite");
const requirePlugin = require('rollup-plugin-require');
const moduleRollupPlugin = require('rollup-plugin-module');
const moduleVitePlugin = require('vite-plugin-module');
const tsdocPlugin = require('./scripts/tsdoc-plugin');

// https://vitejs.dev/config/
module.exports = ({ command, mode }) => {
	return {
		base: "./",
		resolve: {
			alias: [
				{ find: /^@\//, replacement: path.resolve(__dirname, "./example") + "/" },
				{ find: /^@ting-ui\/vue-desktop$/, replacement: path.resolve(__dirname, "./src/index.ts") },
				{ find: /^@ting-ui\/vue-desktop\//, replacement: __dirname + "/" },
			],
		},
		define: {
			__VUE_OPTIONS_API__: false,
		},
		esbuild: false,
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "@/assets/style/_variables.scss";`
				}
			}
		},
		plugins: [
			{
				...vue(),
				enforce: "pre"
			},
			require("./scripts/babel")(require('./tsconfig.json').compilerOptions),
			(function() {
				let plugin = vueJsx({
					tsTransform: 'built-in',
					include: /\.(j|t)sx$/
				});
				plugin.transform.order = undefined;
				plugin.enforce = "pre";
				return plugin;
			})(),
			inject({
				modules: {
					"Symbol.metadata": "sky-core/pure/Symbol/metadata"
				}
			}),
			{
				...moduleRollupPlugin({
					baseUrl: "./example",
					idPrefix: "/example/",
					include: ['example/**'],
					exclude: [/\.(html|css|scss)(\?.*)?/]
				}),
				enforce: "pre",
				apply: "build"
			},
			{
				...moduleVitePlugin({
					baseUrl: "./example",
					idPrefix: "/example/",
					include: ['example/**'],
					exclude: [/\.(html|css|scss)(\?.*)?/]
				}),
				apply: "serve"
			},
			requirePlugin({
				include: ["example/**/*.{tsx,ts}"]
			}),
			mock({
				mockDir: "mock",
				apiPath: "/mock",
				delay: [500, 1000]
			}),
			tsdocPlugin()
		],
		build: {
			minify: process.env.NODE_ENV == "production"
		},
		appType: "mpa"
	};
};
