const path = require("path");
const { defineConfig } = require('vite');
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const inject = require("@rollup/plugin-inject");
const vue = require("@vitejs/plugin-vue");
const vueJsx = require("@vitejs/plugin-vue-jsx");
const sky = require('sky-core/createRollupPlugin');

module.exports = defineConfig(function({ command, mode }) {
	return {
		define: {
			__VUE_OPTIONS_API__: false,
		},
		esbuild: false,
		resolve: {
			dedupe: ['vue', '@vue/runtime-core', '@vue/runtime-dom', '@vue/reactivity', '@vue/shared']
		},
		plugins: [

			{
				...sky('es2015'),
				enforce: "pre"
			},
			(function() {
				let plugin = nodeResolve({
					browser: true,
					resolveOnly: [/^(?!vue$|@vue\/).+/]
				});
				plugin.resolveId.order = undefined;
				plugin.enforce = "pre";
				return plugin;
			})(),
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
			})
		],
		optimizeDeps: {
			include: [],
			exclude: ['sky-core', '@babel/runtime', 'tslib']
		},
		test: {
			environment: 'jsdom',
			globals: true,
			setupFiles: ['tests/setup.ts'],
			include: ['tests/**/*.test.{js,ts,jsx,tsx}'],
			exclude: ['tests/metadata/experimental.test.*', 'tests/type-metadata/**', '**/node_modules/**'],
			coverage: {
				include: ['src/**'],
			},
			server: {
				deps: {
					inline: ['@babel/runtime', 'tslib', '@vue/test-utils', 'vue', '@vue/runtime-core', '@vue/runtime-dom']
				},
			}
		},
	};
});
