const path = require("path");
const fs = require("fs");
const { createRequire } = require("module");
const ts = require("typescript");

const localRequire = createRequire(require.resolve("vite-plugin-module"));
const { createFilter } = localRequire("@rollup/pluginutils");
const MagicString = localRequire("magic-string");
const { walk } = localRequire("estree-walker");

/**
 * 创建 tsdoc vite 插件。
 *
 * 用法：在源码中写 `import.meta.tsdoc.SomeInterface`，插件会解析入口文件（默认 src/index.ts）
 * 的 export 语句，追踪其 re-export 的模块文件，从中找到名为 SomeInterface 的 interface 声明，
 * 提取每个属性的 TSDoc 注释、类型文本与是否可选，在 transform 阶段将该表达式替换为 JSON 数组字面量。
 *
 * 选项：
 * - include: createFilter 的 include，默认 ["example/**"]
 * - exclude: createFilter 的 exclude
 * - entry:   库入口文件路径（相对项目根目录），默认 "src/index.ts"
 */
function createTSDocPlugin(options = {}) {
	const { include = ["example/**/*.{ts,tsx,js,jsx}"], exclude, entry = "src/index.ts" } = options;
	const root = process.cwd();
	const entryPath = path.resolve(root, entry);
	const filter = createFilter(include, exclude);

	const interfaceIndex = new Map();
	const sourceFileCache = new Map();

	function resolveModule(fromFile, spec) {
		if(!spec.startsWith(".")) return null;
		const dir = path.dirname(fromFile);
		const base = path.resolve(dir, spec);
		const candidates = [base + ".tsx", base + ".ts", base + "/index.tsx", base + "/index.ts"];
		for(const c of candidates) {
			if(fs.existsSync(c)) return c;
		}
		return null;
	}

	function indexFile(filePath) {
		if(sourceFileCache.has(filePath)) return;
		const content = fs.readFileSync(filePath, "utf-8");
		const kind = filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
		const sf = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, kind);
		sourceFileCache.set(filePath, sf);
		sf.forEachChild(function(node) {
			if(ts.isInterfaceDeclaration(node)) {
				if(!interfaceIndex.has(node.name.text)) {
					interfaceIndex.set(node.name.text, filePath);
				}
			}
		});
	}

	function parseEntryPoint() {
		if(!fs.existsSync(entryPath)) return;
		indexFile(entryPath);
		const sf = sourceFileCache.get(entryPath);
		sf.forEachChild(function(node) {
			if(ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
				const resolved = resolveModule(entryPath, node.moduleSpecifier.text);
				if(resolved) indexFile(resolved);
			}
		});
	}

	let initialized = false;
	function ensureInit() {
		if(initialized) return;
		initialized = true;
		parseEntryPoint();
	}

	function getJSDocText(node) {
		const comments = ts.getJSDocCommentsAndTags(node);
		for(const c of comments) {
			if(ts.isJSDoc(c)) {
				const cm = c.comment;
				if(typeof cm === "string") {
					return cm.trim();
				}
				if(Array.isArray(cm)) {
					return cm.map(function(p) { return typeof p === "string" ? p : (p && p.text) || ""; }).join("").trim();
				}
			}
		}
		return "";
	}

	function extractInterface(name) {
		const filePath = interfaceIndex.get(name);
		if(!filePath) return null;
		const sf = sourceFileCache.get(filePath);
		let result = null;
		sf.forEachChild(function(node) {
			if(ts.isInterfaceDeclaration(node) && node.name.text === name) {
				const props = [];
				for(const member of node.members) {
					if(ts.isPropertySignature(member) && member.name) {
						props.push({
							name: member.name.getText(sf),
							type: member.type ? member.type.getText(sf) : "",
							optional: !!member.questionToken,
							comment: getJSDocText(member)
						});
					}
				}
				result = props;
			}
		});
		return result;
	}

	function isImportMeta(node) {
		return node && node.type === "MetaProperty"
			&& node.meta && node.meta.name === "import"
			&& node.property && node.property.name === "meta";
	}

	return {
		name: "tsdoc-plugin",
		transform(code, id) {
			if(!filter(id)) return null;
			ensureInit();
			const ast = this.parse(code);
			const targets = [];
			walk(ast, {
				enter(node) {
					if(node.type === "MemberExpression"
						&& node.property && node.property.type === "Identifier"
						&& node.object && node.object.type === "MemberExpression"
						&& node.object.property && node.object.property.type === "Identifier"
						&& node.object.property.name === "tsdoc"
						&& isImportMeta(node.object.object)) {
						targets.push({ start: node.start, end: node.end, name: node.property.name });
					}
				}
			});
			if(!targets.length) return null;
			const ms = new MagicString(code);
			for(const t of targets) {
				ms.overwrite(t.start, t.end, JSON.stringify(extractInterface(t.name)));
			}
			return { code: ms.toString(), map: ms.generateMap({ hires: true }) };
		}
	};
}

module.exports = createTSDocPlugin;
module.exports.default = createTSDocPlugin;
