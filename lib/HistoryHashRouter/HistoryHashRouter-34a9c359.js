import { createVNode } from 'vue';
import { __decorate } from 'tslib';
import { Prop, State, OnDidCreate, OnDidUnmount, Provide, ViewModel, createComponent } from 'vue-clazz-decorator';
import { R as Route } from '../Route/Route-480e21a1.js';

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
let HistoryHashRouterVM = class HistoryHashRouterVM {
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

  /** 当前路径，取自 location.hash。 */
  path = "/";
  /** 当前查询参数，取自 location.hash 中的 query 部分。 */

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
};
__decorate([Prop], HistoryHashRouterVM.prototype, "routes", void 0);
__decorate([Prop], HistoryHashRouterVM.prototype, "loadingComponent", void 0);
__decorate([Prop], HistoryHashRouterVM.prototype, "errorComponent", void 0);
__decorate([State], HistoryHashRouterVM.prototype, "path", void 0);
__decorate([State], HistoryHashRouterVM.prototype, "searchParams", void 0);
__decorate([OnDidCreate], HistoryHashRouterVM.prototype, "onDidCreate", null);
__decorate([OnDidUnmount], HistoryHashRouterVM.prototype, "onDidUnmount", null);
HistoryHashRouterVM = __decorate([Provide('router'), ViewModel], HistoryHashRouterVM);
/** `<HistoryHashRouter>` 的渲染函数（内部使用）。 */
function HistoryHashRouterView(vm) {
  return createVNode(Route, {
    "path": vm.path,
    "routes": vm.routes,
    "loadingComponent": vm.loadingComponent,
    "errorComponent": vm.errorComponent
  }, null);
}

/** 基于 location.hash 的路由组件，路径存于 hash，支持 history API 时产生历史。 */
const HistoryHashRouter = createComponent(HistoryHashRouterView, HistoryHashRouterVM);

export { HistoryHashRouterVM as H, HistoryHashRouterView as a, HistoryHashRouter as b };
