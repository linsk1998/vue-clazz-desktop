import { __decorate } from 'tslib';
import { h, defineAsyncComponent } from 'vue';
import { Inject, Prop, Computed, Provide, Watch, ViewModel, createComponent } from 'vue-clazz-decorator';

/** `<Route>` 组件的 props。 */
/**
 * `<Route>` 的 ViewModel。
 * 向子孙 Provide 自身；inject 祖先 Route，无祖先则作为顶层 Route。
 * 顶层 Route 用传入的 path 与 routes 匹配并渲染对应组件；子 Route 从祖先截取子路径。
 */
let RouteVM = class RouteVM {
  static {
    this.prototype.route = undefined;
    this.prototype.routes = undefined;
    this.prototype.propPath = undefined;
    this.prototype.loadingComponent = undefined;
    this.prototype.errorComponent = undefined;
    this.prototype.abortController = undefined;
  }
  route = null;

  /** 外部传入的 path prop，作为本 Route 匹配的基准路径。 */

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
  abortController = new AbortController();
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
};
__decorate([Inject], RouteVM.prototype, "route", void 0);
__decorate([Prop], RouteVM.prototype, "routes", void 0);
__decorate([Prop('path')], RouteVM.prototype, "propPath", void 0);
__decorate([Computed], RouteVM.prototype, "computedPath", null);
__decorate([Computed], RouteVM.prototype, "fullPath", null);
__decorate([Provide, Prop], RouteVM.prototype, "loadingComponent", void 0);
__decorate([Provide, Prop], RouteVM.prototype, "errorComponent", void 0);
__decorate([Computed], RouteVM.prototype, "routesComputed", null);
__decorate([Computed], RouteVM.prototype, "matchedResult", null);
__decorate([Computed], RouteVM.prototype, "index", null);
__decorate([Computed], RouteVM.prototype, "path", null);
__decorate([Computed], RouteVM.prototype, "params", null);
__decorate([Computed], RouteVM.prototype, "routeView", null);
__decorate([Watch('routeView')], RouteVM.prototype, "onRouteChange", null);
RouteVM = __decorate([Provide('route'), ViewModel], RouteVM);
/** `<Route>` 的渲染函数（内部使用）。 */
function RouteView(props) {
  return props.routeView;
}
/** 路由视图组件，对标 router-view / Outlet，在业务组件中用作路由出口。 */
const Route = createComponent(RouteView, RouteVM);

export { Route as R, RouteVM as a, RouteView as b };
