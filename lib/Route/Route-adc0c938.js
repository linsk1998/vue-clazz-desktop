import _applyDecs from '@babel/runtime/helpers/esm/applyDecs2311';
import { h, defineAsyncComponent } from 'vue';
import { Provide, ViewModel, Inject, Prop, Computed, Watch, createComponent } from 'vue-clazz-decorator';

let _initProto, _initClass, _init_route, _init_extra_route, _init_routes, _init_extra_routes, _init_propPath, _init_extra_propPath, _init_loadingComponent, _init_extra_loadingComponent, _init_errorComponent, _init_extra_errorComponent;

/** `<Route>` 组件的 props。 */
let _RouteVM;
/**
 * `<Route>` 的 ViewModel。
 * 向子孙 Provide 自身；inject 祖先 Route，无祖先则作为顶层 Route。
 * 顶层 Route 用传入的 path 与 routes 匹配并渲染对应组件；子 Route 从祖先截取子路径。
 */
class RouteVM {
  static {
    ({
      e: [_init_route, _init_extra_route, _init_routes, _init_extra_routes, _init_propPath, _init_extra_propPath, _init_loadingComponent, _init_extra_loadingComponent, _init_errorComponent, _init_extra_errorComponent, _initProto],
      c: [_RouteVM, _initClass]
    } = _applyDecs(this, [Provide('route'), ViewModel], [[Inject, 0, "route"], [Prop, 0, "routes"], [Prop('path'), 0, "propPath"], [Computed, 3, "computedPath"], [Computed, 3, "fullPath"], [[Provide, Prop], 0, "loadingComponent"], [[Provide, Prop], 0, "errorComponent"], [Computed, 3, "routesComputed"], [Computed, 3, "matchedResult"], [Computed, 3, "index"], [Computed, 3, "path"], [Computed, 3, "params"], [Computed, 3, "routeView"], [Watch('routeView'), 2, "onRouteChange"]]));
  }
  route = (_initProto(this), _init_route(this, null));
  routes = (_init_extra_route(this), _init_routes(this));
  /** 外部传入的 path prop，作为本 Route 匹配的基准路径。 */
  propPath = (_init_extra_routes(this), _init_propPath(this));
  /** 当前 Route 用于匹配的路径（已扣除祖先路径）。 */
  get computedPath() {
    if (this.propPath != null) {
      return this.propPath;
    }
    if (process.env.NODE_ENV !== 'production') {
      if (!this.route) {
        throw new Error('path is required');
      }
    }
    return this.fullPath.substring(this.route.path.length);
  }
  /** 从顶层 Route 到当前的完整路径。 */
  get fullPath() {
    return this.route ? this.route.fullPath : this.computedPath;
  }
  loadingComponent = (_init_extra_propPath(this), _init_loadingComponent(this));
  errorComponent = (_init_extra_loadingComponent(this), _init_errorComponent(this));
  abortController = (_init_extra_errorComponent(this), new AbortController());
  get routesComputed() {
    if (this.routes) {
      return this.routes;
    }
    if (process.env.NODE_ENV !== 'production') {
      if (!this.route) {
        throw new Error('routes is required');
      }
    }
    return this.route.routesComputed;
  }
  get matchedResult() {
    var groups = null;
    var index = this.routesComputed.findIndex(routeRaw => {
      const base = location.origin + this.computedPath;
      const exactResult = new URLPattern(routeRaw.path, location.origin).exec(base);
      if (exactResult) {
        groups = exactResult.pathname.groups;
        return true;
      }
      if (!routeRaw.exact) {
        const subResult = new URLPattern(`${routeRaw.path}/*`, location.origin).exec(base);
        if (subResult) {
          groups = subResult.pathname.groups;
          return true;
        }
      }
      return false;
    });
    return [index, groups];
  }
  get index() {
    return this.matchedResult[0];
  }
  get path() {
    const matchedRouteRecordRaw = this.routesComputed[this.index];
    if (this.route) {
      return this.route.path + matchedRouteRecordRaw.path;
    }
    return matchedRouteRecordRaw.path;
  }
  /** 当前路由匹配到的路径参数（如 :id 对应的值）。 */
  get params() {
    return this.matchedResult[1];
  }
  /** 匹配的路由组件
   * @internal
   */
  get routeView() {
    const matchedRouteRecordRaw = this.routesComputed[this.index];
    if (!matchedRouteRecordRaw) {
      return null;
    }
    var Component = matchedRouteRecordRaw.component;
    if (typeof Component !== 'function') {
      return h(Component);
    }
    var ComponentPromise = Component({
      abortSignal: this.abortController.signal
    });
    var AsyncComponent = defineAsyncComponent({
      loader: () => ComponentPromise,
      loadingComponent: this.loadingComponent,
      errorComponent: this.errorComponent
    });
    return h(AsyncComponent);
  }
  onRouteChange() {
    this.abortController.abort();
    this.abortController = new AbortController();
  }
  static {
    _initClass();
  }
}
function RouteView(props) {
  return props.routeView;
}
/** 路由视图组件，对标 router-view / Outlet，在业务组件中用作路由出口。 */
const Route = createComponent(RouteView, _RouteVM);

export { Route as R, _RouteVM as _, RouteView as a };
