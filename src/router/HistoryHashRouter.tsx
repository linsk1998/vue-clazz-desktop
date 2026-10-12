import type { Component } from "vue";
import { createComponent, OnDidCreate, OnDidUnmount, Prop, Provide, State, ViewModel } from "vue-clazz-decorator";
import { Route, type RouteRecordRaw } from "./Route";
import { fullPath, type Router } from "./Router";

/** `<HistoryHashRouter>` 的 props。 */
export interface HistoryHashRouterProps {
	/** 路由配置表。 */
	routes: RouteRecordRaw[];
	/** 懒加载期间展示的占位组件，透传给内部 `<Route>`。 */
	loadingComponent?: Component;
	/** 懒加载失败时展示的组件，透传给内部 `<Route>`。 */
	errorComponent?: Component;
}

function isHistoryAPISupported(): boolean {
	return typeof history !== 'undefined' && typeof (history as any).pushState === 'function';
}

const supportsHistoryAPI = isHistoryAPISupported();

/**
 * `<HistoryHashRouter>` 的 ViewModel。
 * 路径取自 location.hash；支持 history API 时用 pushState/replaceState 切换 hash（产生历史），
 * 否则降级用 location.hash 赋值并监听 hashchange。
 * 向子孙 Provide 自身并提供跳转 API。
 */
@Provide('router')
@ViewModel
export class HistoryHashRouterVM implements Router {
	/** @internal */
	@Prop
	public readonly routes: RouteRecordRaw[] = [];
	/** @internal */
	@Prop
	public readonly loadingComponent?: Component;
	/** @internal */
	@Prop
	public readonly errorComponent?: Component;
	/** 当前路径，取自 location.hash。 */
	@State
	public path: string = "/";
	/** 当前查询参数，取自 location.hash 中的 query 部分。 */
	@State
	public searchParams: URLSearchParams;

	@OnDidCreate
	protected onDidCreate() {
		if(supportsHistoryAPI) {
			window.addEventListener('popstate', this.onHashChange);
		} else {
			window.addEventListener('hashchange', this.onHashChange);
		}
		var hash = location.hash;
		if(hash) {
			this.applyHash(hash.substring(1));
		} else {
			this.searchParams = new URLSearchParams();
		}
	}
	private applyHash(full: string) {
		const index = full.indexOf('?');
		if(index >= 0) {
			this.searchParams = new URLSearchParams(full.substring(index + 1));
			this.path = full.substring(0, index);
		} else {
			this.searchParams = new URLSearchParams();
			this.path = full;
		}
	}

	private onHashChange() {
		var hash = location.hash;
		if(hash) {
			this.applyHash(hash.substring(1));
		} else {
			this.path = "/";
			this.searchParams = new URLSearchParams();
		}
	}

	@OnDidUnmount
	protected onDidUnmount() {
		if(supportsHistoryAPI) {
			window.removeEventListener('popstate', this.onHashChange);
		} else {
			window.removeEventListener('hashchange', this.onHashChange);
		}
	}

	/** 压入新路径并写入浏览器历史（hash 形式），可被 back 回退。 */
	public push(path: string) {
		if(path === fullPath(this.path, this.searchParams)) return;
		if(supportsHistoryAPI) {
			history.pushState(history.state, null, '#' + path);
		} else {
			location.hash = '#' + path;
		}
		this.applyHash(path);
	}

	/** 替换当前 hash 路径，覆盖当前历史项。 */
	public replace(path: string) {
		if(supportsHistoryAPI) {
			history.replaceState(history.state, null, '#' + path);
		} else {
			location.replace('#' + path);
		}
		this.applyHash(path);
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

/** `<HistoryHashRouter>` 的渲染函数（内部使用）。 */
export function HistoryHashRouterView(vm: HistoryHashRouterVM) {
	return <Route path={vm.path} routes={vm.routes} loadingComponent={vm.loadingComponent} errorComponent={vm.errorComponent} />;
}

/** 基于 location.hash 的路由组件，路径存于 hash，支持 history API 时产生历史。 */
export const HistoryHashRouter = createComponent<HistoryHashRouterProps, HistoryHashRouterVM>(HistoryHashRouterView, HistoryHashRouterVM);
