import { describe, expect, it, vi } from "vitest";
import { createApp, h } from "vue";
import { Link } from "../../src/button/Link";

function mountLink(props: Record<string, any> | null, slots?: () => any) {
	const container = document.createElement("div");
	const app = createApp({
		setup() {
			return () => h(Link, props, slots);
		},
	});
	app.mount(container);
	return container;
}

describe("Link 渲染", () => {
	it("根元素为 a 标签，默认包含 link link-secondary class", () => {
		const container = mountLink(null);
		const a = container.querySelector("a")!;
		expect(a).not.toBeNull();
		expect(a.classList.contains("link")).toBe(true);
		expect(a.classList.contains("link-secondary")).toBe(true);
	});

	it("draggable 为 false", () => {
		const container = mountLink(null);
		expect(container.querySelector("a")!.getAttribute("draggable")).toBe("false");
	});

	it("无 href 时默认为 javascript:void 0", () => {
		const container = mountLink(null);
		expect(container.querySelector("a")!.getAttribute("href")).toBe("javascript:void 0");
	});

	it("href 设置 a 的 href 属性", () => {
		const container = mountLink({ href: "/home" });
		expect(container.querySelector("a")!.getAttribute("href")).toBe("/home");
	});

	it("type='primary' 添加 link-primary class", () => {
		const container = mountLink({ type: "primary" });
		expect(container.querySelector("a")!.classList.contains("link-primary")).toBe(true);
	});

	it("type='danger' 添加 link-danger class", () => {
		const container = mountLink({ type: "danger" });
		expect(container.querySelector("a")!.classList.contains("link-danger")).toBe(true);
	});

	it("无 type 时默认添加 link-secondary class", () => {
		const container = mountLink(null);
		expect(container.querySelector("a")!.classList.contains("link-secondary")).toBe(true);
	});

	it("disabled 添加 link-disabled class", () => {
		const container = mountLink({ disabled: true });
		expect(container.querySelector("a")!.classList.contains("link-disabled")).toBe(true);
	});

	it("无 disabled 时不添加 link-disabled class", () => {
		const container = mountLink(null);
		expect(container.querySelector("a")!.classList.contains("link-disabled")).toBe(false);
	});

	it("noUnderline 添加 text-decoration-none class", () => {
		const container = mountLink({ noUnderline: true });
		expect(container.querySelector("a")!.classList.contains("text-decoration-none")).toBe(true);
	});

	it("无 noUnderline 时不添加 text-decoration-none class", () => {
		const container = mountLink(null);
		expect(container.querySelector("a")!.classList.contains("text-decoration-none")).toBe(false);
	});
});

describe("Link 子内容", () => {
	it("渲染子内容", () => {
		const container = mountLink(null, () => "提交");
		expect(container.querySelector("a")!.textContent).toContain("提交");
	});

	it("渲染复杂子节点", () => {
		const container = mountLink(null, () => h("span", { class: "label" }, "详情"));
		expect(container.querySelector(".label")!).not.toBeNull();
		expect(container.textContent).toContain("详情");
	});
});

describe("Link 图标", () => {
	it("icon 渲染 Icon 组件", () => {
		const container = mountLink({ icon: "home" });
		const i = container.querySelector("i")!;
		expect(i).not.toBeNull();
		expect(i.classList.contains("fa")).toBe(true);
		expect(i.classList.contains("fa-home")).toBe(true);
	});

	it("无 icon 时不渲染 i 元素", () => {
		const container = mountLink(null);
		expect(container.querySelector("i")).toBeNull();
	});
});

describe("Link 点击", () => {
	it("点击时调用 onClick 回调", () => {
		const onClick = vi.fn();
		const container = mountLink({ onClick });
		container.querySelector("a")!.click();
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(expect.objectContaining({
			event: expect.any(MouseEvent),
		}));
	});

	it("disabled 时点击不调用 onClick", () => {
		const onClick = vi.fn();
		const container = mountLink({ disabled: true, onClick });
		container.querySelector("a")!.click();
		expect(onClick).not.toHaveBeenCalled();
	});

	it("无 onClick 时点击不报错", () => {
		const container = mountLink(null);
		expect(() => container.querySelector("a")!.click()).not.toThrow();
	});
});
