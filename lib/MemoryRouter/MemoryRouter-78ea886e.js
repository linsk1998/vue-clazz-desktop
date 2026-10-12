import { createVNode } from 'vue';
import { __decorate } from 'tslib';
import { Prop, State, OnDidCreate, Provide, ViewModel, createComponent } from 'vue-clazz-decorator';
import { R as Route } from '../Route/Route-480e21a1.js';

/** `<MemoryRouter>` 的 props。 */
/**
 * `<MemoryRouter>` 的 ViewModel。
 * 路径仅存于内存，不产生浏览器历史；向子孙 Provide 自身并提供跳转 API。
 * 内部维护历史栈，支持 back/forward/go 在内存中前进后退。
 */
let MemoryRouterVM = class MemoryRouterVM {
  static {
    this.prototype.routes = undefined;
    this.prototype.loadingComponent = undefined;
    this.prototype.errorComponent = undefined;
    this.prototype.path = undefined;
    this.prototype.searchParams = undefined;
    this.prototype.historyStack = undefined;
    this.prototype.position = undefined;
  }
  /** @internal */
  routes = [];
  /** @internal */

  /** @internal */

  /** 当前路径，以 "/" 开头；同时作为初始路径入参。 */
  path = '/';
  /** 当前查询参数。 */
  searchParams = new URLSearchParams();
  position = 0;
  onDidCreate() {
    this.historyStack = [this.path];
    this.applyPath(this.path);
  }
  applyPath(full) {
    const index = full.indexOf('?');
    if (index >= 0) {
      this.searchParams = new URLSearchParams(full.substring(index + 1));
      this.path = full.substring(0, index);
    } else {
      this.searchParams = new URLSearchParams();
      this.path = full;
    }
  }

  /** 压入新路径，可在之后 back 回退。 */
  push(path) {
    this.historyStack = this.historyStack.slice(0, this.position + 1);
    this.historyStack.push(path);
    this.position = this.historyStack.length - 1;
    this.applyPath(path);
  }

  /** 替换当前路径，不保留回退入口。 */
  replace(path) {
    this.historyStack[this.position] = path;
    this.applyPath(path);
  }

  /** 在内存历史栈中跨步移动，越界时忽略。 */
  go(n) {
    const next = this.position + n;
    if (next < 0 || next >= this.historyStack.length) return;
    this.position = next;
    this.applyPath(this.historyStack[next]);
  }

  /** 后退一步。 */
  back() {
    this.go(-1);
  }

  /** 前进一步。 */
  forward() {
    this.go(1);
  }
};
__decorate([Prop], MemoryRouterVM.prototype, "routes", void 0);
__decorate([Prop], MemoryRouterVM.prototype, "loadingComponent", void 0);
__decorate([Prop], MemoryRouterVM.prototype, "errorComponent", void 0);
__decorate([Prop, State], MemoryRouterVM.prototype, "path", void 0);
__decorate([State], MemoryRouterVM.prototype, "searchParams", void 0);
__decorate([OnDidCreate], MemoryRouterVM.prototype, "onDidCreate", null);
MemoryRouterVM = __decorate([Provide('router'), ViewModel], MemoryRouterVM);
/** `<MemoryRouter>` 的渲染函数（内部使用）。 */
function MemoryRouterView(vm) {
  return createVNode(Route, {
    "path": vm.path,
    "routes": vm.routes,
    "loadingComponent": vm.loadingComponent,
    "errorComponent": vm.errorComponent
  }, null);
}

/** 内存路由组件，路径不写入浏览器 URL，适合无 URL 同步的场景（如弹窗内导航）。 */
const MemoryRouter = createComponent(MemoryRouterView, MemoryRouterVM);

export { MemoryRouterVM as M, MemoryRouterView as a, MemoryRouter as b };
