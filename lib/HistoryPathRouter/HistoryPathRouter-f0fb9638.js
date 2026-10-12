import { createVNode } from 'vue';
import _applyDecs from '@babel/runtime/helpers/esm/applyDecs2311';
import { Provide, ViewModel, Prop, State, OnDidCreate, OnDidUnmount, createComponent } from 'vue-clazz-decorator';
import { R as Route } from '../Route/Route-adc0c938.js';

let _initProto, _initClass, _init_routes, _init_extra_routes, _init_loadingComponent, _init_extra_loadingComponent, _init_errorComponent, _init_extra_errorComponent, _init_path, _init_extra_path, _init_searchParams, _init_extra_searchParams;

/** `<HistoryPathRouter>` 的 props。 */
let _HistoryPathRouterVM;
/**
 * `<HistoryPathRouter>` 的 ViewModel。
 * 用 history API 监听 popstate，路径取自 location.pathname。
 * 向子孙 Provide 自身并提供跳转 API；不支持 history API 时退化为传统 URL 跳转（有刷新）。
 */
class HistoryPathRouterVM {
  static {
    ({
      e: [_init_routes, _init_extra_routes, _init_loadingComponent, _init_extra_loadingComponent, _init_errorComponent, _init_extra_errorComponent, _init_path, _init_extra_path, _init_searchParams, _init_extra_searchParams, _initProto],
      c: [_HistoryPathRouterVM, _initClass]
    } = _applyDecs(this, [Provide('router'), ViewModel], [[Prop, 0, "routes"], [Prop, 0, "loadingComponent"], [Prop, 0, "errorComponent"], [State, 0, "path"], [State, 0, "searchParams"], [OnDidCreate, 2, "onDidCreate"], [OnDidUnmount, 2, "onDidUnmount"]]));
  }
  constructor() {
    _init_extra_searchParams(this);
  }
  /** @internal */
  routes = (_initProto(this), _init_routes(this, []));
  /** @internal */
  loadingComponent = (_init_extra_routes(this), _init_loadingComponent(this));
  /** @internal */
  errorComponent = (_init_extra_loadingComponent(this), _init_errorComponent(this));

  /** 当前路径，取自 location.pathname。 */
  path = (_init_extra_errorComponent(this), _init_path(this, location.pathname));
  /** 当前查询参数，取自 location.search。 */
  searchParams = (_init_extra_path(this), _init_searchParams(this, new URLSearchParams(location.search ? location.search.substring(1) : "")));
  onDidCreate() {
    window.addEventListener('popstate', this.onPopState);
  }
  onPopState() {
    this.path = location.pathname;
    if (location.search) this.searchParams = new URLSearchParams(location.search.substring(1));
  }
  onDidUnmount() {
    window.removeEventListener('popstate', this.onPopState);
  }
  /** 压入新路径并写入浏览器历史，可被 back 回退。 */
  push(path) {
    var index = path.indexOf('?');
    if (index >= 0) {
      this.searchParams = new URLSearchParams(path.substring(index + 1));
      this.path = path.substring(0, index);
    } else {
      this.searchParams = new URLSearchParams();
      this.path = path;
    }
    history.pushState(history.state, null, path + location.hash);
  }
  /** 替换当前路径，覆盖当前历史项。 */
  replace(path) {
    var index = path.indexOf('?');
    if (index >= 0) {
      this.searchParams = new URLSearchParams(path.substring(index + 1));
      this.path = path.substring(0, index);
    } else {
      this.searchParams = new URLSearchParams();
      this.path = path;
    }
    history.replaceState(history.state, null, path);
  }
  /** 调用 history.go 跨步移动。 */
  go(n) {
    history.go(n);
  }
  /** 后退一步。 */
  back() {
    history.back();
  }
  /** 前进一步。 */
  forward() {
    history.forward();
  }
  static {
    _initClass();
  }
}
function HistoryPathRouterView(vm) {
  return createVNode(Route, {
    "path": vm.path,
    "routes": vm.routes,
    "loadingComponent": vm.loadingComponent,
    "errorComponent": vm.errorComponent
  }, null);
}

/** 基于 history API 的路径路由组件，路径即浏览器 URL pathname。 */
const HistoryPathRouter = createComponent(HistoryPathRouterView, _HistoryPathRouterVM);

export { HistoryPathRouterView as H, _HistoryPathRouterVM as _, HistoryPathRouter as a };
