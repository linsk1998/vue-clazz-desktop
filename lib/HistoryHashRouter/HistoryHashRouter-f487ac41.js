import { createVNode } from 'vue';
import _applyDecs from '@babel/runtime/helpers/esm/applyDecs2311';
import { Provide, ViewModel, Prop, State, OnDidCreate, OnDidUnmount, createComponent } from 'vue-clazz-decorator';
import { R as Route } from '../Route/Route-adc0c938.js';

let _initProto, _initClass, _init_routes, _init_extra_routes, _init_loadingComponent, _init_extra_loadingComponent, _init_errorComponent, _init_extra_errorComponent, _init_path, _init_extra_path, _init_searchParams, _init_extra_searchParams;

/** `<HistoryHashRouter>` 的 props。 */

function isHistoryAPISupported() {
  return typeof history !== 'undefined' && typeof history.pushState === 'function';
}
const supportsHistoryAPI = isHistoryAPISupported();

/**
 * `<HistoryHashRouter>` 的 ViewModel。
 * 路径取自 location.hash；支持 history API 时用 pushState/replaceState 切换 hash（产生历史），
 * 否则降级用 location.hash 赋值并监听 hashchange。
 * 向子孙 Provide 自身并提供跳转 API。
 */
let _HistoryHashRouterVM;
class HistoryHashRouterVM {
  static {
    ({
      e: [_init_routes, _init_extra_routes, _init_loadingComponent, _init_extra_loadingComponent, _init_errorComponent, _init_extra_errorComponent, _init_path, _init_extra_path, _init_searchParams, _init_extra_searchParams, _initProto],
      c: [_HistoryHashRouterVM, _initClass]
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
  /** 当前路径，取自 location.hash。 */
  path = (_init_extra_errorComponent(this), _init_path(this, "/"));
  /** 当前查询参数，取自 location.hash 中的 query 部分。 */
  searchParams = (_init_extra_path(this), _init_searchParams(this));
  onDidCreate() {
    if (supportsHistoryAPI) {
      window.addEventListener('popstate', this.onHashChange);
    } else {
      window.addEventListener('hashchange', this.onHashChange);
    }
    var hash = location.hash;
    if (hash) {
      this.applyHash(hash.substring(1));
    } else {
      this.searchParams = new URLSearchParams();
    }
  }
  applyHash(full) {
    const index = full.indexOf('?');
    if (index >= 0) {
      this.searchParams = new URLSearchParams(full.substring(index + 1));
      this.path = full.substring(0, index);
    } else {
      this.searchParams = new URLSearchParams();
      this.path = full;
    }
  }
  onHashChange() {
    var hash = location.hash;
    if (hash) {
      this.applyHash(hash.substring(1));
    } else {
      this.path = "/";
      this.searchParams = new URLSearchParams();
    }
  }
  onDidUnmount() {
    if (supportsHistoryAPI) {
      window.removeEventListener('popstate', this.onHashChange);
    } else {
      window.removeEventListener('hashchange', this.onHashChange);
    }
  }

  /** 压入新路径并写入浏览器历史（hash 形式），可被 back 回退。 */
  push(path) {
    if (supportsHistoryAPI) {
      history.pushState(history.state, null, '#' + path);
    } else {
      location.hash = '#' + path;
    }
    this.applyHash(path);
  }

  /** 替换当前 hash 路径，覆盖当前历史项。 */
  replace(path) {
    if (supportsHistoryAPI) {
      history.replaceState(history.state, null, '#' + path);
    } else {
      location.replace('#' + path);
    }
    this.applyHash(path);
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
function HistoryHashRouterView(vm) {
  return createVNode(Route, {
    "path": vm.path,
    "routes": vm.routes,
    "loadingComponent": vm.loadingComponent,
    "errorComponent": vm.errorComponent
  }, null);
}

/** 基于 location.hash 的路由组件，路径存于 hash，支持 history API 时产生历史。 */
const HistoryHashRouter = createComponent(HistoryHashRouterView, _HistoryHashRouterVM);

export { HistoryHashRouterView as H, _HistoryHashRouterVM as _, HistoryHashRouter as a };
