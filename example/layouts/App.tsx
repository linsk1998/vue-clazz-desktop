import { Aside, Content, Icon, Layout, PlainButton, Route, Sidebar, SidebarBody, SidebarBrand, SidebarHeader, SidebarHeading, SideMenu, SideMenuItem, type Router, type SideMenuItemCallbackArgs } from "@ting-ui/vue-desktop";
import { Computed, createComponent, Inject, OnDidMount, State, ViewModel } from "vue-clazz-decorator";

import logo from "../assets/images/logo.png";
import type SysMenu from "../models/system/menu/SysMenu";
import type { MenuId } from "../models/system/menu/SysMenu";
import request from "../utils/request";
import "./App.scss";

function renderMenuItem(menu: SysMenu, stack: SysMenu[], props: AppVM): any {
	if(menu.children) {
		return <SideMenuItem icon={menu.icon || null} label={menu.menuName}>
			<SideMenu>
				{menu.children.map(child => renderMenuItem(child, [...stack, menu], props))}
			</SideMenu>
		</SideMenuItem>;
	}
	let href = '#';
	stack.forEach(m => href += "/" + m.path);
	href += "/" + menu.path;
	return <SideMenuItem icon={menu.icon || null} label={menu.menuName} href={href} onClick={props.onMenuClick} />;
}

function AppView(props: AppVM) {
	return <div class={props.className}>
		<div class="app-header">
			<Layout>
				<Aside class="inline-flex flex-row">
					<PlainButton class="app-header-button" onClick={props.toggleSidebar}>
						<Icon>navicon</Icon>
					</PlainButton>
				</Aside>
				<Content>

				</Content>
				<Aside class="inline-flex flex-row">
					<PlainButton class="app-header-button">
						<Icon>tshirt</Icon>
					</PlainButton>
					<PlainButton class="app-header-button">
						<Icon>envelope</Icon>
					</PlainButton>
					<PlainButton class="app-header-button">
						<Icon>sign-out</Icon>
					</PlainButton>
				</Aside>
			</Layout>
		</div>
		<div class="app-sidebar">
			<Sidebar fill dark collapsed={props.collapsed}>
				<SidebarHeader>
					<SidebarBrand logo={logo} >Ting Vue App</SidebarBrand>
				</SidebarHeader>
				<SidebarBody>
					<SidebarHeading>概述</SidebarHeading>
					<SideMenu>
						{props.menuTree.overview.map(menu => renderMenuItem(menu, [], props))}
					</SideMenu>
					<SidebarHeading>教程</SidebarHeading>
					<SideMenu>
						{props.menuTree.tutorial.map(menu => renderMenuItem(menu, [], props))}
					</SideMenu>
					<SidebarHeading>组件</SidebarHeading>
					<SideMenu>
						{props.menuTree.component.map(menu => renderMenuItem(menu, [], props))}
					</SideMenu>
					<SidebarHeading>示例</SidebarHeading>
					<SideMenu>
						{props.menuTree.example.map(menu => renderMenuItem(menu, [], props))}
					</SideMenu>
				</SidebarBody>
			</Sidebar>
		</div>
		<div class="app-content">
			<Route />
		</div>
	</div>;
}

@ViewModel
class AppVM {
	@State
	public collapsed = window.innerWidth < 1400;

	@Computed
	get className() {
		let classList = ["app"];
		if(this.collapsed) {
			classList.push("app-has-sidebar-collapsed");
		} else {
			classList.push("app-has-sidebar");
		}
		return classList.join(" ");
	}

	public toggleSidebar() {
		this.collapsed = !this.collapsed;
	}
	public toggleCollapsed() {
		this.collapsed = !this.collapsed;
	}

	@State
	public menus: SysMenu[] = [];

	@OnDidMount
	protected async loadMenus() {
		this.menus = await request({
			url: "getMenus",
			method: "GET"
		});
	}
	@Computed
	get menuTree(): { overview: SysMenu[]; tutorial: SysMenu[]; component: SysMenu[]; example: SysMenu[]; } {
		const list = this.menus;
		const map = new Map<MenuId, SysMenu>();
		list.forEach(m => {
			if(m.menuType === 'M') {
				m.children = [];
			} else {
				m.children = null;
			}
			map.set(m.menuId, m);
		});
		const roots: SysMenu[] = [];
		list.forEach(m => {
			const node = map.get(m.menuId)!;
			if(m.parentId === 0) {
				roots.push(node);
			} else {
				const parent = map.get(m.parentId);
				if(parent && parent.children) {
					parent.children.push(node);
				}
			}
		});
		return {
			overview: roots.filter(m => m.platId === 4),
			tutorial: roots.filter(m => m.platId === 2),
			component: roots.filter(m => m.platId === 3),
			example: roots.filter(m => m.platId === 1)
		};
	}
	@Inject
	private router: Router;
	public onMenuClick({ component }: SideMenuItemCallbackArgs) {
		this.router.push(component.href.substring(1));
	}
}

export default createComponent(AppView, AppVM);
