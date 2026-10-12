import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { JAVASCRIPT_VOID_0 } from "../../src/constant/JAVASCRIPT_VOID_0";
import {
	Sidebar,
	SidebarBody,
	SidebarBrand,
	SidebarFooter,
	SidebarHeader,
	SidebarHeading,
} from "../../src/nav/Sidebar";

describe("Sidebar", () => {
	it("默认渲染只包含 sidebar class", () => {
		const wrapper = mount(Sidebar);
		expect(wrapper.classes()).toEqual(["sidebar"]);
		expect(wrapper.element.tagName).toBe("DIV");
	});

	it("dark 属性添加 sidebar-dark 和 dark class", () => {
		const wrapper = mount(Sidebar, { props: { dark: true } });
		expect(wrapper.classes()).toEqual(["sidebar", "sidebar-dark", "dark"]);
	});

	it("fill 属性添加 sidebar-fill class", () => {
		const wrapper = mount(Sidebar, { props: { fill: true } });
		expect(wrapper.classes()).toEqual(["sidebar", "sidebar-fill"]);
	});

	it("collapsed 属性添加 sidebar-collapsed class", () => {
		const wrapper = mount(Sidebar, { props: { collapsed: true } });
		expect(wrapper.classes()).toEqual(["sidebar", "sidebar-collapsed"]);
	});

	it("同时设置 dark、fill、collapsed 属性", () => {
		const wrapper = mount(Sidebar, {
			props: { dark: true, fill: true, collapsed: true },
		});
		expect(wrapper.classes()).toEqual([
			"sidebar",
			"sidebar-dark",
			"dark",
			"sidebar-fill",
			"sidebar-collapsed",
		]);
	});

	it("属性显式为 false 时不添加对应 class", () => {
		const wrapper = mount(Sidebar, {
			props: { dark: false, fill: false, collapsed: false },
		});
		expect(wrapper.classes()).toEqual(["sidebar"]);
	});

	it("渲染子内容", () => {
		const wrapper = mount(Sidebar, { slots: { default: "侧边栏内容" } });
		expect(wrapper.text()).toContain("侧边栏内容");
	});

	it("渲染复杂子节点", () => {
		const wrapper = mount(Sidebar, {
			slots: {
				default: '<div class="sidebar-header">头部</div><div class="sidebar-body">主体</div>',
			},
		});
		expect(wrapper.find(".sidebar-header").exists()).toBe(true);
		expect(wrapper.find(".sidebar-body").exists()).toBe(true);
		expect(wrapper.text()).toContain("头部");
		expect(wrapper.text()).toContain("主体");
	});
});

describe("SidebarHeader", () => {
	it("渲染 sidebar-header class", () => {
		const wrapper = mount(SidebarHeader);
		expect(wrapper.classes()).toEqual(["sidebar-header"]);
		expect(wrapper.element.tagName).toBe("DIV");
	});

	it("渲染子内容", () => {
		const wrapper = mount(SidebarHeader, { slots: { default: "头部内容" } });
		expect(wrapper.text()).toContain("头部内容");
	});
});

describe("SidebarFooter", () => {
	it("渲染 sidebar-footer class", () => {
		const wrapper = mount(SidebarFooter);
		expect(wrapper.classes()).toEqual(["sidebar-footer"]);
		expect(wrapper.element.tagName).toBe("DIV");
	});

	it("渲染子内容", () => {
		const wrapper = mount(SidebarFooter, { slots: { default: "底部内容" } });
		expect(wrapper.text()).toContain("底部内容");
	});
});

describe("SidebarBrand", () => {
	it("渲染 sidebar-brand class 及根元素为 a 标签", () => {
		const wrapper = mount(SidebarBrand, { props: { logo: "/logo.png" } });
		expect(wrapper.classes()).toContain("sidebar-brand");
		expect(wrapper.element.tagName).toBe("A");
	});

	it("渲染 logo 图片", () => {
		const wrapper = mount(SidebarBrand, { props: { logo: "/logo.png" } });
		const img = wrapper.find("img");
		expect(img.exists()).toBe(true);
		expect(img.attributes("src")).toBe("/logo.png");
	});

	it("提供 href 时链接指向该地址", () => {
		const wrapper = mount(SidebarBrand, {
			props: { logo: "/logo.png", href: "/home" },
		});
		expect(wrapper.attributes("href")).toBe("/home");
	});

	it("省略 href 时使用 javascript:void 0", () => {
		const wrapper = mount(SidebarBrand, { props: { logo: "/logo.png" } });
		expect(wrapper.attributes("href")).toBe(JAVASCRIPT_VOID_0);
		expect(wrapper.attributes("href")).toBe("javascript:void 0");
	});

	it("渲染文本子节点", () => {
		const wrapper = mount(SidebarBrand, {
			props: { logo: "/logo.png" },
			slots: { default: "应用名称" },
		});
		expect(wrapper.text()).toContain("应用名称");
	});

	it("渲染非文本子节点", () => {
		const wrapper = mount(SidebarBrand, {
			props: { logo: "/logo.png" },
			slots: { default: '<span class="brand-text">品牌</span>' },
		});
		expect(wrapper.find(".brand-text").exists()).toBe(true);
		expect(wrapper.text()).toContain("品牌");
	});

	it("同时提供 logo、href 和文本子节点", () => {
		const wrapper = mount(SidebarBrand, {
			props: { logo: "/icon.svg", href: "/dashboard" },
			slots: { default: "控制台" },
		});
		expect(wrapper.attributes("href")).toBe("/dashboard");
		expect(wrapper.find("img").attributes("src")).toBe("/icon.svg");
		expect(wrapper.text()).toContain("控制台");
	});
});

describe("SidebarBody", () => {
	it("渲染 sidebar-body class", () => {
		const wrapper = mount(SidebarBody);
		expect(wrapper.classes()).toEqual(["sidebar-body"]);
		expect(wrapper.element.tagName).toBe("DIV");
	});

	it("渲染子内容", () => {
		const wrapper = mount(SidebarBody, { slots: { default: "主体内容" } });
		expect(wrapper.text()).toContain("主体内容");
	});
});

describe("SidebarHeading", () => {
	it("渲染 sidebar-heading class", () => {
		const wrapper = mount(SidebarHeading);
		expect(wrapper.classes()).toEqual(["sidebar-heading"]);
		expect(wrapper.element.tagName).toBe("DIV");
	});

	it("渲染子内容", () => {
		const wrapper = mount(SidebarHeading, { slots: { default: "分组标题" } });
		expect(wrapper.text()).toContain("分组标题");
	});
});

describe("Sidebar 组合使用", () => {
	it("组合 Sidebar、SidebarHeader、SidebarBrand、SidebarBody、SidebarHeading、SidebarFooter", () => {
		const wrapper = mount(Sidebar, {
			props: { dark: true, fill: true, collapsed: true },
			slots: {
				default: `
					<div class="sidebar-header">
						<a class="sidebar-brand" href="/">
							<img src="/logo.png" />
							<span>应用名称</span>
						</a>
					</div>
					<div class="sidebar-body">
						<div class="sidebar-heading">系统管理</div>
						<ul class="sidebar-menu">菜单项</ul>
					</div>
					<div class="sidebar-footer">版权信息</div>
				`,
			},
		});
		expect(wrapper.classes()).toContain("sidebar");
		expect(wrapper.classes()).toContain("sidebar-dark");
		expect(wrapper.classes()).toContain("sidebar-fill");
		expect(wrapper.classes()).toContain("sidebar-collapsed");
		expect(wrapper.find(".sidebar-header").exists()).toBe(true);
		expect(wrapper.find(".sidebar-brand").exists()).toBe(true);
		expect(wrapper.find(".sidebar-body").exists()).toBe(true);
		expect(wrapper.find(".sidebar-heading").exists()).toBe(true);
		expect(wrapper.find(".sidebar-footer").exists()).toBe(true);
		expect(wrapper.find("img").attributes("src")).toBe("/logo.png");
		expect(wrapper.text()).toContain("应用名称");
		expect(wrapper.text()).toContain("系统管理");
		expect(wrapper.text()).toContain("版权信息");
	});
});
describe("Sidebar 边界条件补充", () => {
	it("class 属性完整字符串验证（dark + fill + collapsed）", () => {
		const wrapper = mount(Sidebar, {
			props: { dark: true, fill: true, collapsed: true },
		});
		expect(wrapper.attributes("class")).toBe(
			"sidebar sidebar-dark dark sidebar-fill sidebar-collapsed",
		);
	});

	it("仅设置 dark 时 class 为 'sidebar sidebar-dark dark'", () => {
		const wrapper = mount(Sidebar, { props: { dark: true } });
		expect(wrapper.attributes("class")).toBe("sidebar sidebar-dark dark");
	});

	it("仅设置 fill 时 class 为 'sidebar sidebar-fill'", () => {
		const wrapper = mount(Sidebar, { props: { fill: true } });
		expect(wrapper.attributes("class")).toBe("sidebar sidebar-fill");
	});

	it("仅设置 collapsed 时 class 为 'sidebar sidebar-collapsed'", () => {
		const wrapper = mount(Sidebar, { props: { collapsed: true } });
		expect(wrapper.attributes("class")).toBe("sidebar sidebar-collapsed");
	});

	it("无子节点时仍渲染根 div 且无子元素", () => {
		const wrapper = mount(Sidebar);
		expect(wrapper.element.tagName).toBe("DIV");
		expect(wrapper.element.children.length).toBe(0);
	});
});

describe("SidebarBrand 边界条件补充", () => {
	it("href 为空字符串时回退到 JAVASCRIPT_VOID_0", () => {
		const wrapper = mount(SidebarBrand, {
			props: { logo: "/logo.png", href: "" },
		});
		expect(wrapper.attributes("href")).toBe(JAVASCRIPT_VOID_0);
	});

	it("无子节点时只渲染 img 元素，无 valign-sibling span", () => {
		const wrapper = mount(SidebarBrand, {
			props: { logo: "/logo.png" },
		});
		expect(wrapper.find("img").exists()).toBe(true);
		expect(wrapper.element.children.length).toBe(1);
		expect(wrapper.find(".valign-sibling").exists()).toBe(false);
	});

	it("logo 为 SVG 路径时正确渲染 src", () => {
		const wrapper = mount(SidebarBrand, {
			props: { logo: "/assets/icon.svg" },
		});
		expect(wrapper.find("img").attributes("src")).toBe("/assets/icon.svg");
	});

	it("同时提供 href 和非文本子节点时正确渲染", () => {
		const wrapper = mount(SidebarBrand, {
			props: { logo: "/logo.png", href: "/home" },
			slots: { default: '<strong class="brand-name">品牌名</strong>' },
		});
		expect(wrapper.attributes("href")).toBe("/home");
		expect(wrapper.find(".brand-name").exists()).toBe(true);
		expect(wrapper.find("img").attributes("src")).toBe("/logo.png");
	});
});

describe("子组件无子节点渲染", () => {
	it("SidebarHeader 无子节点时渲染空 div", () => {
		const wrapper = mount(SidebarHeader);
		expect(wrapper.element.tagName).toBe("DIV");
		expect(wrapper.element.children.length).toBe(0);
	});

	it("SidebarFooter 无子节点时渲染空 div", () => {
		const wrapper = mount(SidebarFooter);
		expect(wrapper.element.tagName).toBe("DIV");
		expect(wrapper.element.children.length).toBe(0);
	});

	it("SidebarBody 无子节点时渲染空 div", () => {
		const wrapper = mount(SidebarBody);
		expect(wrapper.element.tagName).toBe("DIV");
		expect(wrapper.element.children.length).toBe(0);
	});

	it("SidebarHeading 无子节点时渲染空 div", () => {
		const wrapper = mount(SidebarHeading);
		expect(wrapper.element.tagName).toBe("DIV");
		expect(wrapper.element.children.length).toBe(0);
	});
});
