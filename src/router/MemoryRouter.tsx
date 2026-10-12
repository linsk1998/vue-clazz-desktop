import type { Component } from "vue";
import { createComponent, OnDidCreate, Prop, Provide, State, ViewModel } from "vue-clazz-decorator";
import { Route, type RouteRecordRaw } from "./Route";
import { fullPath, type Router } from "./Router";

/** `<MemoryRouter>` 的 props。 */
export interface MemoryRouterProps {
	/** 路由配置表。 */
	routes: RouteRecordRaw[];
	/** 初始路径，默认 "/" */
	path?: string;
	/** 懒加载期间展示的占位组件，透传给内部 `<Route>`。 */
	loadingComponent?: Component;
	/** 懒加载失败时展示的组件，透传给内部 `<Route>`。 */
	errorComponent?: Component;
}

/**
 * `<MemoryRouter>` 的 ViewModel。
 * 路径仅存于内存，不产生浏览器历史；向子孙 Provide 自身并提供跳转 API。
 * 内部维护历史栈，支持 back/forward/go 在内存中前进后退。
 */
@Provide('router')
@ViewModel
export class MemoryRouterVM implements Router {
	/** @internal */
	@Prop
	public readonly routes: RouteRecordRaw[] = [];
	/** @internal */
	@Prop
	public readonly loadingComponent?: Component;
	/** @internal */
	@Prop
	public readonly errorComponent?: Component;
	/** 当前路径，以 "/" 开头；同时作为初始路径入参。 */
	@Prop
	@State
	public path: string = '/';
	/** 当前查询参数。 */
	@State
	public searchParams: URLSearchParams = new URLSearchParams();

	private historyStack: string[];
	private position: number = 0;

	@OnDidCreate
	protected onDidCreate() {
		this.historyStack = [this.path];
		this.applyPath(this.path);
	}

	private applyPath(full: string) {
		const index = full.indexOf('?');
		if(index >= 0) {
			this.searchParams = new URLSearchParams(full.substring(index + 1));
			this.path = full.substring(0, index);
		} else {
			this.searchParams = new URLSearchParams();
			this.path = full;
		}
	}

	/** 压入新路径，可在之后 back 回退。 */
	public push(path: string) {
		if(path === fullPath(this.path, this.searchParams)) return;
		this.historyStack = this.historyStack.slice(0, this.position + 1);
		this.historyStack.push(path);
		this.position = this.historyStack.length - 1;
		this.applyPath(path);
	}

	/** 替换当前路径，不保留回退入口。 */
	public replace(path: string) {
		this.historyStack[this.position] = path;
		this.applyPath(path);
	}

	/** 在内存历史栈中跨步移动，越界时忽略。 */
	public go(n: number) {
		const next = this.position + n;
		if(next < 0 || next >= this.historyStack.length) return;
		this.position = next;
		this.applyPath(this.historyStack[next]);
	}

	/** 后退一步。 */
	public back() {
		this.go(-1);
	}

	/** 前进一步。 */
	public forward() {
		this.go(1);
	}
}

/** `<MemoryRouter>` 的渲染函数（内部使用）。 */
export function MemoryRouterView(vm: MemoryRouterVM) {
	return <Route path={vm.path} routes={vm.routes} loadingComponent={vm.loadingComponent} errorComponent={vm.errorComponent} />;
}

/** 内存路由组件，路径不写入浏览器 URL，适合无 URL 同步的场景（如弹窗内导航）。 */
export const MemoryRouter = createComponent<MemoryRouterProps, MemoryRouterVM>(MemoryRouterView, MemoryRouterVM);
