import type { Component } from "vue";
import { createComponent, OnDidCreate, OnDidUnmount, Prop, Provide, State, ViewModel } from "vue-clazz-decorator";
import { Route, type RouteRecordRaw } from "./Route";
import { fullPath, type Router } from "./Router";

/** `<HistoryPathRouter>` 的 props。 */
export interface HistoryPathRouterProps {
	/** 路由配置表。 */
	routes: RouteRecordRaw[];
	/** 懒加载期间展示的占位组件，透传给内部 `<Route>`。 */
	loadingComponent?: Component;
	/** 懒加载失败时展示的组件，透传给内部 `<Route>`。 */
	errorComponent?: Component;
}

/**
 * `<HistoryPathRouter>` 的 ViewModel。
 * 用 history API 监听 popstate，路径取自 location.pathname。
 * 向子孙 Provide 自身并提供跳转 API；不支持 history API 时退化为传统 URL 跳转（有刷新）。
 */
@Provide('router')
@ViewModel
export class HistoryPathRouterVM implements Router {
	/** @internal */
	@Prop
	public readonly routes: RouteRecordRaw[] = [];
	/** @internal */
	@Prop
	public readonly loadingComponent?: Component;
	/** @internal */
	@Prop
	public readonly errorComponent?: Component;

	/** 当前路径，取自 location.pathname。 */
	@State
	public path: string = location.pathname;
	/** 当前查询参数，取自 location.search。 */
	@State
	public searchParams: URLSearchParams = new URLSearchParams(location.search ? location.search.substring(1) : "");

	@OnDidCreate
	protected onDidCreate() {
		window.addEventListener('popstate', this.onPopState);
	}
	private onPopState() {
		this.path = location.pathname;
		if(location.search)
			this.searchParams = new URLSearchParams(location.search.substring(1));
	}
	@OnDidUnmount
	protected onDidUnmount() {
		window.removeEventListener('popstate', this.onPopState);
	}
	/** 压入新路径并写入浏览器历史，可被 back 回退。 */
	public push(path: string) {
		if(path === fullPath(this.path, this.searchParams)) return;
		var index = path.indexOf('?');
		if(index >= 0) {
			this.searchParams = new URLSearchParams(path.substring(index + 1));
			this.path = path.substring(0, index);
		} else {
			this.searchParams = new URLSearchParams();
			this.path = path;
		}
		history.pushState(history.state, null, path + location.hash);
	}
	/** 替换当前路径，覆盖当前历史项。 */
	public replace(path: string) {
		var index = path.indexOf('?');
		if(index >= 0) {
			this.searchParams = new URLSearchParams(path.substring(index + 1));
			this.path = path.substring(0, index);
		} else {
			this.searchParams = new URLSearchParams();
			this.path = path;
		}
		history.replaceState(history.state, null, path);
	}
	/** 调用 history.go 跨步移动。 */
	public go(n: number) {
		history.go(n);
	}
	/** 后退一步。 */
	public back() {
		history.back();
	}
	/** 前进一步。 */
	public forward() {
		history.forward();
	}
}

/** `<HistoryPathRouter>` 的渲染函数（内部使用）。 */
export function HistoryPathRouterView(vm: HistoryPathRouterVM) {
	return <Route path={vm.path} routes={vm.routes} loadingComponent={vm.loadingComponent} errorComponent={vm.errorComponent} />;
}

/** 基于 history API 的路径路由组件，路径即浏览器 URL pathname。 */
export const HistoryPathRouter = createComponent<HistoryPathRouterProps, HistoryPathRouterVM>(HistoryPathRouterView, HistoryPathRouterVM);
