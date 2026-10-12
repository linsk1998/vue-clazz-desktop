import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { createApp, h, nextTick } from "vue";
import { SideMenu, SideMenuGroup, SideMenuItem, SideMenuView } from "../../src/nav/SideMenu";

/**
 * 通过 createApp 将渲染函数挂载到真实 DOM 上。
 * 用于绕过 @vue/test-utils 对 vue-clazz-decorator createComponent
 * 所创建组件的 devtoolsRawSetupState 兼容性问题。
 */
function mountDOM(render: () => any) {
	const container = document.createElement("div");
	createApp({ render }).mount(container);
	return container;
}

/**
 * 在两层嵌套 SideMenu 内挂载子节点，使内部 SideMenuItem 的 inSubMenu=true。
 * 外层 SideMenu 的 inSubMenu=false，内层 SideMenu 被外层 provide 注入故 inSubMenu=true。
 */
function mountInSubMenu(render: () => any) {
	return mountDOM(() => h(SideMenu, null, () => h(SideMenu, null, render)));
}

describe("SideMenuGroup", () => {
	it("渲染 sidebar-group class 及根元素为 div", () => {
		const wrapper = mount(SideMenuGroup);
		expect(wrapper.classes()).toEqual(["sidebar-group"]);
		expect(wrapper.element.tagName).toBe("DIV");
	});

	it("渲染子内容", () => {
		const wrapper = mount(SideMenuGroup, { slots: { default: "分组内容" } });
		expect(wrapper.text()).toContain("分组内容");
	});

	it("渲染复杂子节点", () => {
		const wrapper = mount(SideMenuGroup, {
			slots: {
				default: '<div class="group-item-a">项A</div><div class="group-item-b">项B</div>',
			},
		});
		expect(wrapper.find(".group-item-a").exists()).toBe(true);
		expect(wrapper.find(".group-item-b").exists()).toBe(true);
		expect(wrapper.text()).toContain("项A");
		expect(wrapper.text()).toContain("项B");
	});
});

describe("SideMenuView", () => {
	it("inSubMenu 为 false 时渲染 sidebar-menu 及根元素为 ul", () => {
		const container = mountDOM(() => h(SideMenuView, { inSubMenu: false }));
		const menu = container.querySelector(".sidebar-menu");
		expect(menu).not.toBeNull();
		expect(menu!.tagName).toBe("UL");
		expect(container.querySelector(".sidebar-collapsible")).toBeNull();
		expect(container.querySelector(".sidebar-submenu")).toBeNull();
	});

	it("inSubMenu 为 true 时渲染 sidebar-collapsible 包裹 sidebar-submenu", () => {
		const container = mountDOM(() => h(SideMenuView, { inSubMenu: true }));
		const collapsible = container.querySelector(".sidebar-collapsible");
		const submenu = container.querySelector(".sidebar-submenu");
		expect(collapsible).not.toBeNull();
		expect(collapsible!.tagName).toBe("DIV");
		expect(submenu).not.toBeNull();
		expect(submenu!.tagName).toBe("UL");
		expect(container.querySelector(".sidebar-menu")).toBeNull();
	});

	it("inSubMenu 为 false 时子内容渲染在 sidebar-menu 内", () => {
		const container = mountDOM(() => h(SideMenuView, { inSubMenu: false }, () => "菜单内容"));
		const menu = container.querySelector(".sidebar-menu");
		expect(menu).not.toBeNull();
		expect(menu!.textContent).toContain("菜单内容");
	});

	it("inSubMenu 为 true 时子内容渲染在 sidebar-submenu 内", () => {
		const container = mountDOM(() => h(SideMenuView, { inSubMenu: true }, () => "子菜单内容"));
		const submenu = container.querySelector(".sidebar-submenu");
		expect(submenu).not.toBeNull();
		expect(submenu!.textContent).toContain("子菜单内容");
	});
});

describe("SideMenu", () => {
	it("顶层渲染 sidebar-menu class 及根元素为 ul", () => {
		const container = mountDOM(() => h(SideMenu));
		const menu = container.querySelector(".sidebar-menu");
		expect(menu).not.toBeNull();
		expect(menu!.tagName).toBe("UL");
	});

	it("顶层不渲染 sidebar-collapsible 和 sidebar-submenu", () => {
		const container = mountDOM(() => h(SideMenu));
		expect(container.querySelector(".sidebar-collapsible")).toBeNull();
		expect(container.querySelector(".sidebar-submenu")).toBeNull();
	});

	it("渲染子内容", () => {
		const container = mountDOM(() => h(SideMenu, null, () => "菜单内容"));
		expect(container.textContent).toContain("菜单内容");
	});

	it("渲染多个菜单项子节点", () => {
		const container = mountDOM(() => h(SideMenu, null, () => [
			h("li", { class: "menu-item-1" }, "首页"),
			h("li", { class: "menu-item-2" }, "设置"),
		]));
		expect(container.querySelector(".menu-item-1")).not.toBeNull();
		expect(container.querySelector(".menu-item-2")).not.toBeNull();
		expect(container.textContent).toContain("首页");
		expect(container.textContent).toContain("设置");
	});

	it("嵌套使用时外层渲染 sidebar-menu，内层渲染 sidebar-collapsible + sidebar-submenu", () => {
		const container = mountDOM(() => h(SideMenu, null, () => h(SideMenu, null, () => "嵌套菜单内容")));
		const menu = container.querySelector(".sidebar-menu");
		expect(menu).not.toBeNull();
		expect(menu!.tagName).toBe("UL");
		const collapsible = container.querySelector(".sidebar-collapsible");
		expect(collapsible).not.toBeNull();
		expect(collapsible!.tagName).toBe("DIV");
		const submenu = container.querySelector(".sidebar-submenu");
		expect(submenu).not.toBeNull();
		expect(submenu!.tagName).toBe("UL");
		expect(container.textContent).toContain("嵌套菜单内容");
	});

	it("顶层 sidebar-menu 直接作为容器根元素", () => {
		const container = mountDOM(() => h(SideMenu, null, () => "顶层内容"));
		expect(container.firstElementChild).not.toBeNull();
		expect(container.firstElementChild!.tagName).toBe("UL");
		expect(container.firstElementChild!.classList.contains("sidebar-menu")).toBe(true);
	});
});

describe("SideMenuItem", () => {
	it("渲染根元素为 li", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页" }));
		expect(container.firstElementChild!.tagName).toBe("LI");
	});

	it("渲染 sidebar-label 文本", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页" }));
		expect(container.querySelector(".sidebar-label")!.textContent).toBe("首页");
		expect(container.textContent).toContain("首页");
	});

	it("渲染 sidebar-link 锚点", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页" }));
		const link = container.querySelector(".sidebar-link")!;
		expect(link).not.toBeNull();
		expect(link.tagName).toBe("A");
	});

	it("提供 href 时链接指向该地址", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页", href: "/home" }));
		expect(container.querySelector(".sidebar-link")!.getAttribute("href")).toBe("/home");
	});

	it("省略 href 时 href 属性为 null", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页" }));
		expect(container.querySelector(".sidebar-link")!.getAttribute("href")).toBeNull();
	});

	it("提供 target 时设置 target 属性", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页", href: "/home", target: "_blank" }));
		expect(container.querySelector(".sidebar-link")!.getAttribute("target")).toBe("_blank");
	});

	it("省略 target 时 target 属性为 null", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页" }));
		expect(container.querySelector(".sidebar-link")!.getAttribute("target")).toBeNull();
	});

	it("提供 icon 时渲染图标元素", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页", icon: "home" }));
		const icon = container.querySelector(".sidebar-icon")!;
		expect(icon).not.toBeNull();
		expect(icon.tagName).toBe("I");
	});

	it("icon 渲染包含 fa 和 fa-home 类名", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页", icon: "home" }));
		const icon = container.querySelector(".sidebar-icon")!;
		expect(icon.classList.contains("fa")).toBe(true);
		expect(icon.classList.contains("fa-home")).toBe(true);
	});

	it("省略 icon 时不渲染 sidebar-icon", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页" }));
		expect(container.querySelector(".sidebar-icon")).toBeNull();
	});

	it("有子节点时渲染折叠指示箭头", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "设置" }, () => h("div", { class: "sub-content" }, "子菜单")));
		const indicator = container.querySelector(".sidebar-indicator")!;
		expect(indicator).not.toBeNull();
		expect(indicator.tagName).toBe("I");
	});

	it("无子节点时不渲染折叠指示箭头", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页" }));
		expect(container.querySelector(".sidebar-indicator")).toBeNull();
	});

	it("渲染子节点内容", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "设置" }, () => h("div", { class: "sub-content" }, "子菜单内容")));
		expect(container.querySelector(".sub-content")).not.toBeNull();
		expect(container.textContent).toContain("子菜单内容");
	});

	it("同时提供 label、icon、href、target", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页", icon: "home", href: "/dashboard", target: "_blank" }));
		expect(container.querySelector(".sidebar-label")!.textContent).toBe("首页");
		const icon = container.querySelector(".sidebar-icon")!;
		expect(icon.classList.contains("fa-home")).toBe(true);
		const link = container.querySelector(".sidebar-link")!;
		expect(link.getAttribute("href")).toBe("/dashboard");
		expect(link.getAttribute("target")).toBe("_blank");
	});

	it("有子节点且提供 icon 时同时渲染图标和指示箭头", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "设置", icon: "cog" }, () => h("div", { class: "sub" }, "子菜单")));
		expect(container.querySelector(".sidebar-icon")).not.toBeNull();
		expect(container.querySelector(".sidebar-indicator")).not.toBeNull();
		expect(container.querySelector(".sidebar-label")!.textContent).toBe("设置");
	});

	it("非 inSubMenu 时折叠指示箭头位于 icon 之后", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "设置", icon: "cog" }, () => h("div", "子菜单")));
		const anchor = container.querySelector(".sidebar-link")!;
		const children = Array.from(anchor.children);
		const iconIdx = children.findIndex(c => c.classList.contains("sidebar-icon"));
		const indicatorIdx = children.findIndex(c => c.classList.contains("sidebar-indicator"));
		expect(iconIdx).toBeGreaterThanOrEqual(0);
		expect(indicatorIdx).toBeGreaterThanOrEqual(0);
		expect(indicatorIdx).toBeGreaterThan(iconIdx);
	});

	it("默认 collapsed 为 true 时 li 包含 collapsed class", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页" }));
		expect(container.querySelector(".sidebar-item")!.classList.contains("collapsed")).toBe(true);
	});
});

describe("SideMenuItem inSubMenu 分支", () => {
	it("inSubMenu 时渲染 valign-middle 而非 sidebar-label", () => {
		const container = mountInSubMenu(() => h(SideMenuItem, { label: "子项" }));
		expect(container.querySelector(".valign-middle")!.textContent).toBe("子项");
		expect(container.querySelector(".sidebar-label")).toBeNull();
	});

	it("inSubMenu 时锚点不渲染 sidebar-link class", () => {
		const container = mountInSubMenu(() => h(SideMenuItem, { label: "子项", href: "/sub" }));
		const anchor = container.querySelector(".sidebar-item a")!;
		expect(anchor.classList.contains("sidebar-link")).toBe(false);
		expect(anchor.getAttribute("href")).toBe("/sub");
	});

	it("inSubMenu 时 icon 用 icon-fw icon-left 而非 sidebar-icon", () => {
		const container = mountInSubMenu(() => h(SideMenuItem, { label: "子项", icon: "home" }));
		expect(container.querySelector(".sidebar-icon")).toBeNull();
		const icon = container.querySelector(".icon-fw")!;
		expect(icon.classList.contains("icon-left")).toBe(true);
		expect(icon.classList.contains("fa")).toBe(true);
		expect(icon.classList.contains("fa-home")).toBe(true);
	});

	it("inSubMenu 时省略 icon 不渲染图标", () => {
		const container = mountInSubMenu(() => h(SideMenuItem, { label: "子项" }));
		expect(container.querySelector(".icon-fw")).toBeNull();
		expect(container.querySelector(".sidebar-icon")).toBeNull();
	});

	it("inSubMenu 时折叠指示箭头在 a 内最前", () => {
		const container = mountInSubMenu(() => h(SideMenuItem, { label: "父项" }, () => h("div", "子内容")));
		const anchor = container.querySelector(".sidebar-item a")!;
		const firstChild = anchor.firstElementChild!;
		expect(firstChild.classList.contains("sidebar-indicator")).toBe(true);
	});

	it("inSubMenu 时无子节点不渲染折叠指示箭头", () => {
		const container = mountInSubMenu(() => h(SideMenuItem, { label: "子项" }));
		expect(container.querySelector(".sidebar-indicator")).toBeNull();
	});

	it("inSubMenu 时有子节点渲染子内容", () => {
		const container = mountInSubMenu(() => h(SideMenuItem, { label: "父项" }, () => h("div", { class: "deep-content" }, "深层内容")));
		expect(container.querySelector(".deep-content")).not.toBeNull();
		expect(container.textContent).toContain("深层内容");
	});
});

describe("SideMenuItem 交互行为", () => {
	it("无子节点且有 onClick 时点击触发 handleClick 并 preventDefault", () => {
		let received: any;
		const container = mountDOM(() => h(SideMenuItem, {
			label: "首页",
			onClick: (args: any) => { received = args; },
		}));
		const link = container.querySelector(".sidebar-link") as HTMLElement;
		const event = new MouseEvent("click", { cancelable: true, bubbles: true });
		link.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
		expect(received).toBeDefined();
		expect(received.event).toBe(event);
		expect(received.component).toBeDefined();
	});

	it("无子节点且无 onClick 时点击不报错", () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "首页" }));
		const link = container.querySelector(".sidebar-link") as HTMLElement;
		const event = new MouseEvent("click", { cancelable: true, bubbles: true });
		link.dispatchEvent(event);
		expect(link).toBeTruthy();
	});

	it("有子节点时点击切换 collapsed 状态", async () => {
		const container = mountDOM(() => h(SideMenuItem, { label: "设置" }, () => h("div", "子菜单")));
		const item = container.querySelector(".sidebar-item") as HTMLElement;
		expect(item.classList.contains("collapsed")).toBe(true);
		const link = container.querySelector(".sidebar-link") as HTMLElement;
		link.click();
		await nextTick();
		expect(item.classList.contains("collapsed")).toBe(false);
		link.click();
		await nextTick();
		expect(item.classList.contains("collapsed")).toBe(true);
	});

	it("inSubMenu 时有子节点点击同样切换 collapsed", async () => {
		const container = mountInSubMenu(() => h(SideMenuItem, { label: "父项" }, () => h("div", "子内容")));
		const item = container.querySelector(".sidebar-item") as HTMLElement;
		expect(item.classList.contains("collapsed")).toBe(true);
		const anchor = item.querySelector("a") as HTMLElement;
		anchor.click();
		await nextTick();
		expect(item.classList.contains("collapsed")).toBe(false);
	});
});

describe("SideMenu 组合使用", () => {
	it("组合 SideMenu、SideMenuGroup、SideMenuItem", () => {
		const container = mountDOM(() => h(SideMenu, null, () => h(SideMenuGroup, null, () => [
			h(SideMenuItem, { label: "首页", icon: "home", href: "/" }),
			h(SideMenuItem, { label: "设置", icon: "cog" }, () => h(SideMenu, null, () => "子菜单")),
		])));
		expect(container.querySelector(".sidebar-menu")).not.toBeNull();
		expect(container.querySelector(".sidebar-group")).not.toBeNull();
		const labels = container.querySelectorAll(".sidebar-label");
		expect(labels[0].textContent).toBe("首页");
		expect(labels[1].textContent).toBe("设置");
		expect(container.querySelector(".sidebar-indicator")).not.toBeNull();
		expect(container.textContent).toContain("子菜单");
	});

	it("嵌套 SideMenuItem + SideMenu 形成多级菜单", () => {
		const container = mountDOM(() => h(SideMenu, null, () => h(SideMenuItem, { label: "设置", icon: "cog" }, () => h(SideMenu, null, () => [
			h(SideMenuItem, { label: "通用", href: "/settings/general" }),
			h(SideMenuItem, { label: "安全", href: "/settings/security" }),
		]))));
		expect(container.querySelector(".sidebar-menu")).not.toBeNull();
		// 外层 SideMenuItem inSubMenu=false → sidebar-label
		const topLabel = container.querySelector(".sidebar-label");
		expect(topLabel!.textContent).toBe("设置");
		// 内层 SideMenuItem inSubMenu=true → valign-middle
		const subLabels = container.querySelectorAll(".valign-middle");
		expect(subLabels[0].textContent).toBe("通用");
		expect(subLabels[1].textContent).toBe("安全");
		expect(container.querySelector(".sidebar-indicator")).not.toBeNull();
		// 外层有 sidebar-link，内层无；用 a 标签统一查 href
		const anchors = container.querySelectorAll("a");
		const hrefs = Array.from(anchors).map(a => a.getAttribute("href"));
		expect(hrefs).toContain("/settings/general");
		expect(hrefs).toContain("/settings/security");
	});

	it("多个 SideMenuGroup 分组渲染", () => {
		const container = mountDOM(() => h(SideMenu, null, () => [
			h(SideMenuGroup, null, () => h(SideMenuItem, { label: "组1项A", href: "/a" })),
			h(SideMenuGroup, null, () => h(SideMenuItem, { label: "组2项B", href: "/b" })),
		]));
		const groups = container.querySelectorAll(".sidebar-group");
		expect(groups).toHaveLength(2);
		const labels = container.querySelectorAll(".sidebar-label");
		expect(labels[0].textContent).toBe("组1项A");
		expect(labels[1].textContent).toBe("组2项B");
	});

	it("三层嵌套 SideMenuItem 形成多级菜单结构", () => {
		const container = mountDOM(() => h(SideMenu, null, () => h(SideMenuItem, { label: "一级", icon: "layer" }, () => h(SideMenu, null, () => h(SideMenuItem, { label: "二级", icon: "sub" }, () => h(SideMenu, null, () => h(SideMenuItem, { label: "三级", href: "/deep" })))))));
		// 一级 inSubMenu=false → sidebar-label + sidebar-icon
		const topLabel = container.querySelector(".sidebar-label");
		expect(topLabel!.textContent).toBe("一级");
		// 二级、三级 inSubMenu=true → valign-middle
		const subLabels = container.querySelectorAll(".valign-middle");
		expect(subLabels[0].textContent).toBe("二级");
		expect(subLabels[1].textContent).toBe("三级");
		const indicators = container.querySelectorAll(".sidebar-indicator");
		expect(indicators.length).toBeGreaterThanOrEqual(2);
		// 一级有 sidebar-icon，二级用 icon-fw
		expect(container.querySelector(".sidebar-icon")).not.toBeNull();
		expect(container.querySelector(".icon-fw")).not.toBeNull();
		// 三级 href
		const anchors = container.querySelectorAll("a");
		const hrefs = Array.from(anchors).map(a => a.getAttribute("href"));
		expect(hrefs).toContain("/deep");
	});
});
