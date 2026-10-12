import { defineAsyncComponent, h, type Component } from "vue";
import { Computed, createComponent, Inject, Prop, Provide, ViewModel, Watch, type VueJsxComponent } from "vue-clazz-decorator";

/** 选项式组件类型，排除函数式组件。 */
export type OptionsComponent = Exclude<Component, Function>;
/** 路由懒加载函数，接收 abortSignal 用于取消加载，返回组件或其默认导出。 */
export type RouteLoadComponent = (loadComponentArgs: { abortSignal: AbortSignal; }) => Promise<{ default: OptionsComponent; } | OptionsComponent>;

/** 单条路由配置。 */
export interface RouteRecordRaw {
	/** 路由路径模板，支持 URLPattern 语法（如 "/user/:id"）。 */
	path: string;
	/** 查询参数，键值对形式。 */
	query?: Record<string, string>;
	/** 路由元信息，可携带任意业务数据。 */
	meta?: Record<string, any>;
	/** 是否精确匹配；为 false 时允许作为子路由前缀匹配。 */
	exact?: boolean;
	/** 子路由配置，用于嵌套路由。 */
	children?: RouteRecordRaw[];
	/** 路由组件，可为同步组件或懒加载函数。 */
	component?: OptionsComponent | VueJsxComponent<any> | RouteLoadComponent;
};

/** `<Route>` 组件的 props。 */
export interface RouteProps {
	/** 要展示的路径，以“/”开头 */
	path?: string;
	/** 路由配置表，从上到下匹配，先匹配者优先。 */
	routes?: RouteRecordRaw[];
	/** 懒加载期间展示的占位组件。 */
	loadingComponent?: Component;
	/** 懒加载失败时展示的组件。 */
	errorComponent?: Component;
}

/**
 * `<Route>` 的 ViewModel。
 * 向子孙 Provide 自身；inject 祖先 Route，无祖先则作为顶层 Route。
 * 顶层 Route 用传入的 path 与 routes 匹配并渲染对应组件；子 Route 从祖先截取子路径。
 */
@Provide('route')
@ViewModel
export class RouteVM {
	@Inject
	private route: RouteVM = null;
	@Prop
	private routes: RouteRecordRaw[];
	/** 外部传入的 path prop，作为本 Route 匹配的基准路径。 */
	@Prop('path')
	public propPath: string;
	/** 当前 Route 用于匹配的路径（已扣除祖先路径）。 */
	@Computed
	public get computedPath(): string {
		if(this.propPath != null) {
			return this.propPath;
		}
		if(process.env.NODE_ENV !== 'production') {
			if(!this.route) {
				throw new Error('path is required');
			}
		}
		return this.fullPath.substring(this.route.path.length);
	}
	/** 从顶层 Route 到当前的完整路径。 */
	@Computed
	public get fullPath(): string {
		return this.route ? this.route.fullPath : this.computedPath;
	}

	@Provide
	@Prop
	private loadingComponent: Component;
	@Provide
	@Prop
	private errorComponent: Component;

	private abortController = new AbortController();

	@Computed
	private get routesComputed(): RouteRecordRaw[] {

		if(this.routes) {
			return this.routes;
		}
		if(process.env.NODE_ENV !== 'production') {
			if(!this.route) {
				throw new Error('routes is required');
			}
		}
		const matched = this.route.routesComputed[this.route.index];
		return matched?.children ?? [];
	}
	@Computed
	private get matchedResult(): [number, Record<string, string>] {
		var groups: Record<string, string> = null;
		var index = this.routesComputed.findIndex(routeRaw => {
			const base = location.origin + this.computedPath;
			const exactResult = new URLPattern(routeRaw.path, location.origin).exec(base);
			if(exactResult) {
				groups = exactResult.pathname.groups;
				return true;
			}
			if(!routeRaw.exact) {
				const subResult = new URLPattern(`${routeRaw.path}/*`, location.origin).exec(base);
				if(subResult) {
					groups = subResult.pathname.groups;
					return true;
				}
			}
			return false;
		});
		return [index, groups];
	}
	@Computed
	private get index() {
		return this.matchedResult[0];
	}
	@Computed
	private get path() {
		const matchedRouteRecordRaw = this.routesComputed[this.index];
		if(this.route) {
			return this.route.path + matchedRouteRecordRaw.path;
		}
		return matchedRouteRecordRaw.path;
	}
	/** 当前路由匹配到的路径参数（如 :id 对应的值）。 */
	@Computed
	public get params() {
		return this.matchedResult[1];
	}
	/** 匹配的路由组件
	 * @internal
	 */
	@Computed
	public get routeView() {
		const matchedRouteRecordRaw = this.routesComputed[this.index];
		if(!matchedRouteRecordRaw) {
			return null;
		}
		var Component = matchedRouteRecordRaw.component as OptionsComponent | RouteLoadComponent;
		if(typeof Component !== 'function') {
			return h(Component);
		}

		var ComponentPromise = Component({ abortSignal: this.abortController.signal });
		var AsyncComponent = defineAsyncComponent({
			loader: () => ComponentPromise,
			loadingComponent: this.loadingComponent,
			errorComponent: this.errorComponent
		});
		return h(AsyncComponent);
	}

	@Watch('routeView')
	protected onRouteChange() {
		this.abortController.abort();
		this.abortController = new AbortController();
	}
}

/** `<Route>` 的渲染函数（内部使用）。 */
export function RouteView(props: RouteVM) {
	return props.routeView;
}
/** 路由视图组件，对标 router-view / Outlet，在业务组件中用作路由出口。 */
export const Route = createComponent<RouteProps, RouteVM>(RouteView, RouteVM);
