import { createVNode } from 'vue';
import { __decorate } from 'tslib';
import { Prop, State, OnDidCreate, OnDidUnmount, Provide, ViewModel, createComponent } from 'vue-clazz-decorator';
import { R as Route } from '../Route/Route-480e21a1.js';

/** `<HistoryPathRouter>` 的 props。 */
/**
 * `<HistoryPathRouter>` 的 ViewModel。
 * 用 history API 监听 popstate，路径取自 location.pathname。
 * 向子孙 Provide 自身并提供跳转 API；不支持 history API 时退化为传统 URL 跳转（有刷新）。
 */
let HistoryPathRouterVM = class HistoryPathRouterVM {
  static {
    this.prototype.routes = undefined;
    this.prototype.loadingComponent = undefined;
    this.prototype.errorComponent = undefined;
    this.prototype.path = undefined;
    this.prototype.searchParams = undefined;
  }
  /** @internal */
  routes = [];
  /** @internal */

  /** @internal */

  /** 当前路径，取自 location.pathname。 */
  path = location.pathname;
  /** 当前查询参数，取自 location.search。 */
  searchParams = new URLSearchParams(location.search ? location.search.substring(1) : "");
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
};
__decorate([Prop], HistoryPathRouterVM.prototype, "routes", void 0);
__decorate([Prop], HistoryPathRouterVM.prototype, "loadingComponent", void 0);
__decorate([Prop], HistoryPathRouterVM.prototype, "errorComponent", void 0);
__decorate([State], HistoryPathRouterVM.prototype, "path", void 0);
__decorate([State], HistoryPathRouterVM.prototype, "searchParams", void 0);
__decorate([OnDidCreate], HistoryPathRouterVM.prototype, "onDidCreate", null);
__decorate([OnDidUnmount], HistoryPathRouterVM.prototype, "onDidUnmount", null);
HistoryPathRouterVM = __decorate([Provide('router'), ViewModel], HistoryPathRouterVM);
/** `<HistoryPathRouter>` 的渲染函数（内部使用）。 */
function HistoryPathRouterView(vm) {
  return createVNode(Route, {
    "path": vm.path,
    "routes": vm.routes,
    "loadingComponent": vm.loadingComponent,
    "errorComponent": vm.errorComponent
  }, null);
}

/** 基于 history API 的路径路由组件，路径即浏览器 URL pathname。 */
const HistoryPathRouter = createComponent(HistoryPathRouterView, HistoryPathRouterVM);

export { HistoryPathRouterVM as H, HistoryPathRouterView as a, HistoryPathRouter as b };
