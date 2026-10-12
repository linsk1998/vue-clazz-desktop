import { createVNode } from 'vue';
import { useChildren } from 'vue-clazz-decorator';

const JAVASCRIPT_VOID_0 = "javascript:void 0";

/**
 * {@link Sidebar} 的属性。
 */

/**
 * 侧边栏根容器，内部按需组合 {@link SidebarHeader} / {@link SidebarBody} 等子组件。
 *
 * @example
 * ```tsx
 * <Sidebar dark>
 *   <SidebarHeader>...</SidebarHeader>
 *   <SidebarBody>...</SidebarBody>
 * </Sidebar>
 * ```
 */
function Sidebar(props) {
  const children = useChildren();
  let classList = ["sidebar"];
  if (props.dark) classList.push("sidebar-dark dark");
  if (props.fill) classList.push("sidebar-fill");
  if (props.collapsed) classList.push("sidebar-collapsed");
  return createVNode("div", {
    "class": classList.join(" ")
  }, [children]);
}

/**
 * 侧边栏头部区域，放在 {@link Sidebar} 内部顶部，常用于放置 {@link SidebarBrand} 或折叠按钮。
 */
function SidebarHeader() {
  const children = useChildren();
  return createVNode("div", {
    "class": "sidebar-header"
  }, [children]);
}

/**
 * 侧边栏底部区域，放在 {@link Sidebar} 内部底部，常用于放置版权信息或额外链接。
 */
function SidebarFooter() {
  const children = useChildren();
  return createVNode("div", {
    "class": "sidebar-footer"
  }, [children]);
}

/**
 * {@link SidebarBrand} 的属性。
 */

/**
 * 品牌/Logo 区块，通常放在 {@link SidebarHeader} 中。
 *
 * 文本子节点会自动与 Logo 垂直对齐。
 *
 * @example
 * ```tsx
 * <SidebarBrand logo="/logo.png" href="/">应用名称</SidebarBrand>
 * ```
 */
function SidebarBrand(props) {
  const {
    logo,
    href
  } = props;
  const children = useChildren();
  return createVNode("a", {
    "class": "sidebar-brand",
    "href": href || JAVASCRIPT_VOID_0
  }, [createVNode("img", {
    "src": logo
  }, null), typeof children === "string" ? createVNode("span", {
    "class": "valign-sibling"
  }, [children]) : children]);
}

/**
 * 侧边栏主体区域，用于放置 {@link SideMenu} 等内容。
 */
function SidebarBody() {
  const children = useChildren();
  return createVNode("div", {
    "class": "sidebar-body"
  }, [children]);
}

/**
 * 分组标题，用于在 {@link SidebarBody} 中为菜单分组添加小标题。
 *
 * @example
 * ```tsx
 * <SidebarHeading>系统管理</SidebarHeading>
 * ```
 */
function SidebarHeading() {
  const children = useChildren();
  return createVNode("div", {
    "class": "sidebar-heading"
  }, [children]);
}

export { Sidebar as S, SidebarHeader as a, SidebarFooter as b, SidebarBrand as c, SidebarBody as d, SidebarHeading as e };
