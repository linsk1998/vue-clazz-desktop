import { Computed, createComponent, Inject, Prop, Provide, State, use, useChildren, ViewModel } from "vue-clazz-decorator";
import { Action } from "../hooks/Action";
import { Icon } from "../views/Icon";

/**
 * 分组容器，将多个 {@link SideMenu} 或菜单项归为一组。
 */
export function SideMenuGroup() {
	const children = useChildren();
	return <div class="sidebar-group">{children}</div>;
}

/**
 * SideMenu 组件的属性接口。
 */
export interface SideMenuProps {

}

/** 视图实现，请直接使用 {@link SideMenu}。 */
export function SideMenuView(props: SideMenuVM) {
	const children = useChildren();
	if(props.inSubMenu) {
		return <div class="sidebar-collapsible">
			<ul class="sidebar-submenu">{children}</ul>
		</div>;
	}
	return <ul class="sidebar-menu">{children}</ul>;
}

/** 视图模型，请直接使用 {@link SideMenu}。 */
@ViewModel
@Provide('sideMenu')
export class SideMenuVM {
	@Inject
	private sideMenu: SideMenuVM;

	/** @internal */
	@Provide
	@Computed
	public get inSubMenu() {
		return this.sideMenu !== undefined;
	}
}

/**
 * 侧边栏菜单容器，用于包裹 {@link SideMenuItem}。
 *
 * 可嵌套使用以形成多级子菜单，嵌套时自动切换为子菜单样式。
 *
 * @example
 * ```tsx
 * <SideMenu>
 *   <SideMenuItem label="首页" icon="home" href="/" />
 *   <SideMenuItem label="设置" icon="cog">
 *     <SideMenu>
 *       <SideMenuItem label="通用" href="/settings/general" />
 *       <SideMenuItem label="安全" href="/settings/security" />
 *     </SideMenu>
 *   </SideMenuItem>
 * </SideMenu>
 * ```
 */
export const SideMenu = createComponent(SideMenuView, SideMenuVM);

/**
 * {@link SideMenuItem} 的属性。
 */
interface SideMenuItemProps {
	/** 跳转地址，省略则不跳转 */
	href?: string;
	/** `<a target>` 属性，如 `"_blank"` */
	target?: string;
	/** 图标名称，作为 {@link Icon} 的内容显示在文本前 */
	icon?: string;
	/** 菜单文本 */
	label: string;
	/** 点击时触发 */
	onClick?: (e: SideMenuItemCallbackArgs) => Promise<any> | void;
}
export interface SideMenuItemCallbackArgs {
	event: MouseEvent;
	component: SideMenuItemVM;
}

export function SideMenuItemView(props: SideMenuItemVM) {
	const { label, icon, href, target } = props;
	const children = useChildren();
	const hasChildren = children && children.length;
	const onClick = hasChildren ? props.toggleCollapsed : props.onClick ? props.handleClick : undefined;
	const classList = ["sidebar-item"];
	if(props.collapsed) {
		classList.push("collapsed");
	}
	if(props.inSubMenu) {
		return <li class={classList.join(" ")}>
			<a href={href} target={target} onClick={onClick}>
				{hasChildren ?
					<i class="sidebar-indicator"></i> :
					null
				}
				{icon ?
					<Icon fw position="left">{icon}</Icon> :
					null
				}
				<span class="valign-middle">{label}</span>
			</a>
			{children}
		</li>;
	}
	return <li class={classList.join(" ")}>
		<a class="sidebar-link" href={href} target={target} title={label} onClick={onClick}>
			{icon ?
				<Icon class="sidebar-icon">{icon}</Icon> :
				null
			}
			{hasChildren ?
				<i class="sidebar-indicator"></i> :
				null
			}
			<span class="sidebar-label">{label}</span>
		</a>
		{children}
	</li>;
};

@ViewModel
export class SideMenuItemVM implements SideMenuItemProps {
	/** @internal */
	@Inject
	public readonly inSubMenu: boolean;
	/** @internal */
	@Prop
	public readonly label: string;
	/** @internal */
	@Prop
	public readonly icon: string;
	/** @internal */
	@Prop
	public readonly href: string;
	/** @internal */
	@Prop
	public readonly target: string;

	public action = use(Action);

	@Prop
	public readonly onClick: (e: SideMenuItemCallbackArgs) => Promise<any> | void;
	@State
	public collapsed: boolean = true;
	public handleClick(e: MouseEvent) {
		if(this.onClick) {
			e.preventDefault();
			this.action.execute(this.onClick, [{ event: e, component: this }]);
		}
	}
	public toggleCollapsed() {
		this.collapsed = !this.collapsed;
	}
}

/**
 * 侧边栏菜单项，需作为 {@link SideMenu} 的子级使用。
 *
 * 传入子节点即视为可展开项，会自动显示折叠指示箭头。
 *
 * @example
 * ```tsx
 * // 普通链接项
 * <SideMenuItem label="首页" icon="home" href="/" />
 *
 * // 可展开项（带子菜单）
 * <SideMenuItem label="设置" icon="cog">
 *   <SideMenu>...</SideMenu>
 * </SideMenuItem>
 * ```
 */
export const SideMenuItem = createComponent<SideMenuItemProps, SideMenuItemVM>(SideMenuItemView, SideMenuItemVM);
