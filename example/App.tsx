import { Aside, Content, HistoryHashRouter, Icon, Layout, PlainButton, Sidebar, SidebarBody, SidebarBrand, SidebarHeader, SidebarHeading, SideMenu, SideMenuItem, type Router, type RouteRecordRaw, type RouteVM, type SideMenuItemCallbackArgs } from "@ting-ui/vue-desktop";
import { Computed, createComponent, OnDidMount, Provide, Ref, State, ViewModel } from "vue-clazz-decorator";

import logo from "@/assets/images/logo.png";
import type SysMenu from "@/models/system/menu/SysMenu";
import request from "@/utils/request";
import type { Ajax } from "sky-ajax";
import "./App.scss";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

interface SidePlatMenuProps {
	platId?: number;
	menuTree?: SysMenu[];
	menus?: SysMenu[];
	onClick?: (e: SideMenuItemCallbackArgs) => Promise<any> | void;
}

function SidePlatMenu(props: SidePlatMenuProps) {
	const { menuTree, platId } = props;
	const menus = props.menus || menuTree.filter(menu => menu.platId === platId);
	return <SideMenu>
		{
			menus.map(menu => {
				if(menu.children) {
					return <SideMenuItem icon={menu.icon || null} label={menu.menuName}>
						<SidePlatMenu menuTree={menuTree} menus={menu.children} />
					</SideMenuItem>;
				}
				return <SideMenuItem icon={menu.icon || null} label={menu.menuName} href={'#' + menu.path} onClick={props.onClick} />;
			})
		}
	</SideMenu>;
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
					<SidebarBrand logo={logo} href="#" onClick={props.handleGoHome}>Ting Vue App</SidebarBrand>
				</SidebarHeader>
				<SidebarBody>
					<SidebarHeading>概述</SidebarHeading>
					<SidePlatMenu
						platId={4}
						menuTree={props.menuTree}
						onClick={props.handleMenuClick}
					/>
					<SidebarHeading>教程</SidebarHeading>
					<SidePlatMenu
						platId={2}
						menuTree={props.menuTree}
						onClick={props.handleMenuClick}
					/>
					<SidebarHeading>组件</SidebarHeading>
					<SidePlatMenu
						platId={3}
						menuTree={props.menuTree}
						onClick={props.handleMenuClick}
					/>
					<SidebarHeading>示例</SidebarHeading>
					<SidePlatMenu
						platId={1}
						menuTree={props.menuTree}
						onClick={props.handleMenuClick}
					/>
				</SidebarBody>
			</Sidebar>
		</div>
		<div class="app-content">
			<HistoryHashRouter
				ref="router"
				routes={props.routes}
				onRouteChange={props.handleRouteChange}
			/>
		</div>
	</div>;
}

@ViewModel
class AppVM {
	@Provide
	public ajax: Ajax = request;
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
	public routes: RouteRecordRaw[] = [];
	@State
	public menuTree: SysMenu[] = [];

	@OnDidMount
	protected async loadMenus() {
		var menus: SysMenu[] = await request({
			url: "getMenus",
			method: "GET"
		});
		var pages = import.meta.glob("./pages/**/index.tsx");
		var routes = [];
		var stack: SysMenu[] = [];
		const walkMenu = function(this: SysMenu, menu: SysMenu, index: number): SysMenu {
			stack.push(menu);
			var path = this ? `${this.path}/${menu.path}` : `/${menu.path}`;
			menu.path = path;
			if(menu.menuType === 'M') {
				menu.children = menus.filter(m => m.parentId === menu.menuId).map(walkMenu, menu);
			} else if(menu.menuType === 'C') {
				menu.children = null;
				let component = pages[`./pages${path}/index.tsx`];
				if(component) {
					routes.push({
						path: path,
						component,
						meta: {
							title: menu.menuName,
							icon: menu.icon,
							stack: [...stack]
						}
					});
				}
			}
			stack.pop();
			return menu;
		};
		this.menuTree = menus.filter(m => m.parentId === 0).map(walkMenu, null);
		routes.push(
			{ path: "", exact: true, component: Home },
			{ path: "", component: NotFound }
		);
		this.routes = routes;
	}
	@Ref
	private router: Router;
	public handleMenuClick({ component }: SideMenuItemCallbackArgs) {
		this.router.push(component.href.substring(1));
	}
	public handleGoHome() {
		this.router.push("");
	}
	public handleRouteChange(route: RouteVM) {
		console.log(route.meta);
	}
}

export default createComponent(AppView, AppVM);
