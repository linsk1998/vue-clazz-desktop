import { describe, expect, it, vi } from "vitest";
import { createApp, h } from "vue";
import { Button } from "../../src/button/Button";

function mountButton(props: Record<string, any> | null, slots?: () => any, provides?: Record<string, any>) {
	const container = document.createElement("div");
	const app = createApp({
		setup() {
			return () => h(Button, props, slots);
		},
	});
	if(provides) {
		for(const [key, value] of Object.entries(provides)) {
			app.provide(key, { get: () => value, set() {} });
		}
	}
	app.mount(container);
	return container;
}

describe("Button 渲染", () => {
	it("根元素为 button，默认包含 btn btn-default class", () => {
		const container = mountButton(null);
		const btn = container.querySelector("button")!;
		expect(btn).not.toBeNull();
		expect(btn.classList.contains("btn")).toBe(true);
		expect(btn.classList.contains("btn-default")).toBe(true);
	});

	it("block 添加 btn-block class", () => {
		const container = mountButton({ block: true });
		expect(container.querySelector("button")!.classList.contains("btn-block")).toBe(true);
	});

	it("shape='round' 添加 btn-round class", () => {
		const container = mountButton({ shape: "round" });
		expect(container.querySelector("button")!.classList.contains("btn-round")).toBe(true);
	});

	it("shape='circle' 无 size 时添加 btn-round 和 btn-square", () => {
		const container = mountButton({ shape: "circle" });
		const btn = container.querySelector("button")!;
		expect(btn.classList.contains("btn-round")).toBe(true);
		expect(btn.classList.contains("btn-square")).toBe(true);
	});

	it("shape='circle' 有 size 时添加 btn-square-{size}", () => {
		const container = mountButton({ shape: "circle", size: "lg" });
		const btn = container.querySelector("button")!;
		expect(btn.classList.contains("btn-square-lg")).toBe(true);
	});

	it("type='primary' 添加 btn-primary class", () => {
		const container = mountButton({ type: "primary" });
		expect(container.querySelector("button")!.classList.contains("btn-primary")).toBe(true);
	});

	it("type='primary' outline 添加 btn-outline-primary class", () => {
		const container = mountButton({ type: "primary", outline: true });
		expect(container.querySelector("button")!.classList.contains("btn-outline-primary")).toBe(true);
	});

	it("无 type 时添加 btn-default class", () => {
		const container = mountButton(null);
		expect(container.querySelector("button")!.classList.contains("btn-default")).toBe(true);
	});

	it("size='lg' 添加 btn-lg class", () => {
		const container = mountButton({ size: "lg" });
		expect(container.querySelector("button")!.classList.contains("btn-lg")).toBe(true);
	});

	it("size='sm' 添加 btn-sm class", () => {
		const container = mountButton({ size: "sm" });
		expect(container.querySelector("button")!.classList.contains("btn-sm")).toBe(true);
	});

	it("loading 添加 btn-loading class 且 disabled", () => {
		const container = mountButton({ loading: true });
		const btn = container.querySelector("button")!;
		expect(btn.classList.contains("btn-loading")).toBe(true);
		expect(btn.disabled).toBe(true);
	});

	it("disabled prop 添加 btn-disabled class 且 disabled", () => {
		const container = mountButton({ disabled: true });
		const btn = container.querySelector("button")!;
		expect(btn.classList.contains("btn-disabled")).toBe(true);
		expect(btn.disabled).toBe(true);
	});

	it("context disabled inject 添加 btn-disabled class 且 disabled", () => {
		const container = mountButton(null, undefined, { disabled: true });
		const btn = container.querySelector("button")!;
		expect(btn.classList.contains("btn-disabled")).toBe(true);
		expect(btn.disabled).toBe(true);
	});

	it("nativeType 设置 button 的 type 属性", () => {
		const container = mountButton({ nativeType: "submit" });
		expect(container.querySelector("button")!.type).toBe("submit");
	});

	it("省略 nativeType 时默认为 button", () => {
		const container = mountButton(null);
		expect(container.querySelector("button")!.type).toBe("button");
	});

	it("title 设置 button 的 title 属性", () => {
		const container = mountButton({ title: "提示" });
		expect(container.querySelector("button")!.title).toBe("提示");
	});
});

describe("Button 子内容", () => {
	it("渲染 btn-label span 包含子内容", () => {
		const container = mountButton(null, () => "点击我");
		const label = container.querySelector(".btn-label")!;
		expect(label).not.toBeNull();
		expect(label.textContent).toContain("点击我");
	});

	it("badge 渲染为 badge span", () => {
		const container = mountButton({ badge: 5 });
		const badge = container.querySelector(".badge")!;
		expect(badge).not.toBeNull();
		expect(badge.textContent).toBe("5");
	});

	it("badge 为字符串时渲染对应文本", () => {
		const container = mountButton({ badge: "New" });
		expect(container.querySelector(".badge")!.textContent).toBe("New");
	});

	it("无 badge 时不渲染 badge span", () => {
		const container = mountButton(null);
		expect(container.querySelector(".badge")).toBeNull();
	});
});

describe("Button 图标", () => {
	it("icon 渲染 Icon 组件", () => {
		const container = mountButton({ icon: "home" });
		const i = container.querySelector("i")!;
		expect(i).not.toBeNull();
		expect(i.classList.contains("fa")).toBe(true);
		expect(i.classList.contains("fa-home")).toBe(true);
	});

	it("icon 有子内容时添加 btn-icon-left class", () => {
		const container = mountButton({ icon: "home" }, () => "点击");
		const i = container.querySelector("i")!;
		expect(i.classList.contains("btn-icon-left")).toBe(true);
	});

	it("无 icon 时不渲染 i 元素", () => {
		const container = mountButton(null);
		expect(container.querySelector("i")).toBeNull();
	});
});

describe("Button 点击", () => {
	it("点击时调用 onClick 回调", () => {
		const onClick = vi.fn();
		const container = mountButton({ onClick });
		container.querySelector("button")!.click();
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(expect.objectContaining({
			event: expect.any(MouseEvent),
		}));
	});

	it("loading 时点击不调用 onClick", () => {
		const onClick = vi.fn();
		const container = mountButton({ loading: true, onClick });
		container.querySelector("button")!.click();
		expect(onClick).not.toHaveBeenCalled();
	});

	it("disabled prop 时点击不调用 onClick", () => {
		const onClick = vi.fn();
		const container = mountButton({ disabled: true, onClick });
		container.querySelector("button")!.click();
		expect(onClick).not.toHaveBeenCalled();
	});

	it("context disabled inject 时点击不调用 onClick", () => {
		const onClick = vi.fn();
		const container = mountButton({ onClick }, undefined, { disabled: true });
		container.querySelector("button")!.click();
		expect(onClick).not.toHaveBeenCalled();
	});

	it("无 onClick 时点击不报错", () => {
		const container = mountButton(null);
		expect(() => container.querySelector("button")!.click()).not.toThrow();
	});
});
