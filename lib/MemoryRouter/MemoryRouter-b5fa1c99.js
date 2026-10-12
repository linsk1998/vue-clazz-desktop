import { createVNode } from 'vue';
import _applyDecs from '@babel/runtime/helpers/esm/applyDecs2311';
import { Provide, ViewModel, Prop, State, OnDidCreate, createComponent } from 'vue-clazz-decorator';
import { R as Route } from '../Route/Route-adc0c938.js';

let _initProto, _initClass, _init_routes, _init_extra_routes, _init_loadingComponent, _init_extra_loadingComponent, _init_errorComponent, _init_extra_errorComponent, _init_path, _init_extra_path, _init_searchParams, _init_extra_searchParams;

/** `<MemoryRouter>` 的 props。 */
let _MemoryRouterVM;
/**
 * `<MemoryRouter>` 的 ViewModel。
 * 路径仅存于内存，不产生浏览器历史；向子孙 Provide 自身并提供跳转 API。
 * 内部维护历史栈，支持 back/forward/go 在内存中前进后退。
 */
class MemoryRouterVM {
  static {
    ({
      e: [_init_routes, _init_extra_routes, _init_loadingComponent, _init_extra_loadingComponent, _init_errorComponent, _init_extra_errorComponent, _init_path, _init_extra_path, _init_searchParams, _init_extra_searchParams, _initProto],
      c: [_MemoryRouterVM, _initClass]
    } = _applyDecs(this, [Provide('router'), ViewModel], [[Prop, 0, "routes"], [Prop, 0, "loadingComponent"], [Prop, 0, "errorComponent"], [[Prop, State], 0, "path"], [State, 0, "searchParams"], [OnDidCreate, 2, "onDidCreate"]]));
  }
  /** @internal */
  routes = (_initProto(this), _init_routes(this, []));
  /** @internal */
  loadingComponent = (_init_extra_routes(this), _init_loadingComponent(this));
  /** @internal */
  errorComponent = (_init_extra_loadingComponent(this), _init_errorComponent(this));
  /** 当前路径，以 "/" 开头；同时作为初始路径入参。 */
  path = (_init_extra_errorComponent(this), _init_path(this, '/'));
  /** 当前查询参数。 */
  searchParams = (_init_extra_path(this), _init_searchParams(this, new URLSearchParams()));
  historyStack = void _init_extra_searchParams(this);
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
  static {
    _initClass();
  }
}
function MemoryRouterView(vm) {
  return createVNode(Route, {
    "path": vm.path,
    "routes": vm.routes,
    "loadingComponent": vm.loadingComponent,
    "errorComponent": vm.errorComponent
  }, null);
}

/** 内存路由组件，路径不写入浏览器 URL，适合无 URL 同步的场景（如弹窗内导航）。 */
const MemoryRouter = createComponent(MemoryRouterView, _MemoryRouterVM);

export { MemoryRouterView as M, _MemoryRouterVM as _, MemoryRouter as a };
