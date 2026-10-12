import { useChildren } from "vue-clazz-decorator";
import { JAVASCRIPT_VOID_0 } from "../constant/JAVASCRIPT_VOID_0";

/**
 * {@link Sidebar} 的属性。
 */
export interface SidebarProps {
	/** 是否折叠为窄栏 */
	collapsed?: boolean;
	/** 是否启用深色主题 */
	dark?: boolean;
	/** 是否撑满可用宽度 */
	fill?: boolean;
}

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
export function Sidebar(props: SidebarProps) {
	const children = useChildren();
	let classList = ["sidebar"];
	if(props.dark) classList.push("sidebar-dark dark");
	if(props.fill) classList.push("sidebar-fill");
	if(props.collapsed) classList.push("sidebar-collapsed");
	return <div class={classList.join(" ")}>{children}</div>;
}

/**
 * 侧边栏头部区域，放在 {@link Sidebar} 内部顶部，常用于放置 {@link SidebarBrand} 或折叠按钮。
 */
export function SidebarHeader() {
	const children = useChildren();
	return <div class="sidebar-header">{children}</div>;
}

/**
 * 侧边栏底部区域，放在 {@link Sidebar} 内部底部，常用于放置版权信息或额外链接。
 */
export function SidebarFooter() {
	const children = useChildren();
	return <div class="sidebar-footer">{children}</div>;
}

/**
 * {@link SidebarBrand} 的属性。
 */
export interface SidebarBrandProps {
	/** 点击跳转地址，省略时不跳转 */
	href?: string;
	/** Logo 图片地址 */
	logo: string;
}

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
export function SidebarBrand(props: SidebarBrandProps) {
	const { logo, href } = props;
	const children = useChildren();
	return <a class="sidebar-brand" href={href || JAVASCRIPT_VOID_0}>
		<img src={logo} />
		{typeof children === "string" ?
			<span class="valign-sibling">{children}</span> :
			children
		}
	</a>;
}

/**
 * 侧边栏主体区域，用于放置 {@link SideMenu} 等内容。
 */
export function SidebarBody() {
	const children = useChildren();
	return <div class="sidebar-body">{children}</div>;
}

/**
 * 分组标题，用于在 {@link SidebarBody} 中为菜单分组添加小标题。
 *
 * @example
 * ```tsx
 * <SidebarHeading>系统管理</SidebarHeading>
 * ```
 */
export function SidebarHeading() {
	const children = useChildren();
	return <div class="sidebar-heading">{children}</div>;
}
