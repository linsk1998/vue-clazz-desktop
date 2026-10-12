import { describe, expect, it, vi } from "vitest";
import { createApp, h } from "vue";
import { PlainButton } from "../../src/button/PlainButton";

function mountPlainButton(props: Record<string, any> | null, slots?: () => any) {
	const container = document.createElement("div");
	const app = createApp({
		setup() {
			return () => h(PlainButton, props, slots);
		},
	});
	app.mount(container);
	return container;
}

describe("PlainButton 渲染", () => {
	it("根元素为 a 标签", () => {
		const container = mountPlainButton(null);
		expect(container.querySelector("a")!).not.toBeNull();
	});

	it("href 为 javascript:void 0", () => {
		const container = mountPlainButton(null);
		expect(container.querySelector("a")!.getAttribute("href")).toBe("javascript:void 0");
	});

	it("draggable 为 false", () => {
		const container = mountPlainButton(null);
		expect(container.querySelector("a")!.getAttribute("draggable")).toBe("false");
	});

	it("title 设置 a 的 title 属性", () => {
		const container = mountPlainButton({ title: "提示" });
		expect(container.querySelector("a")!.getAttribute("title")).toBe("提示");
	});

	it("无 disabled 时不添加 disabled class", () => {
		const container = mountPlainButton(null);
		expect(container.querySelector("a")!.classList.contains("disabled")).toBe(false);
	});

	it("disabled 添加 disabled class", () => {
		const container = mountPlainButton({ disabled: true });
		expect(container.querySelector("a")!.classList.contains("disabled")).toBe(true);
	});
});

describe("PlainButton 子内容", () => {
	it("渲染子内容", () => {
		const container = mountPlainButton(null, () => "点击我");
		expect(container.querySelector("a")!.textContent).toContain("点击我");
	});

	it("渲染复杂子节点", () => {
		const container = mountPlainButton(null, () => h("span", { class: "icon" }, "图标"));
		expect(container.querySelector(".icon")!).not.toBeNull();
		expect(container.textContent).toContain("图标");
	});
});

describe("PlainButton 点击", () => {
	it("点击时调用 onClick 回调", () => {
		const onClick = vi.fn();
		const container = mountPlainButton({ onClick });
		container.querySelector("a")!.click();
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(expect.objectContaining({
			event: expect.any(MouseEvent),
		}));
	});

	it("disabled 时点击不调用 onClick", () => {
		const onClick = vi.fn();
		const container = mountPlainButton({ disabled: true, onClick });
		container.querySelector("a")!.click();
		expect(onClick).not.toHaveBeenCalled();
	});

	it("无 onClick 时点击不报错", () => {
		const container = mountPlainButton(null);
		expect(() => container.querySelector("a")!.click()).not.toThrow();
	});
});
