import { createVNode, isVNode } from 'vue';
import { __decorate } from 'tslib';
import { State, ViewModel, Inject, Provide, Computed, createComponent, use, Prop, useChildren } from 'vue-clazz-decorator';
import { I as Icon } from '../Icon/Icon-66d21ba0.js';

let Action = class Action {
  static {
    this.prototype.loading = undefined;
    this.prototype.error = undefined;
  }
  loading = false;
  error = null;
  execute(fn, args) {
    this.loading = true;
    this.error = null;
    var promise;
    try {
      promise = fn(...args);
      if (promise && typeof promise.then === 'function') {
        promise.then(result => {
          this.loading = false;
        }, error => {
          this.loading = false;
          this.error = error;
        });
      } else {
        this.loading = false;
      }
    } catch (e) {
      this.error = e;
      this.loading = false;
    }
    return promise;
  }
};
__decorate([State], Action.prototype, "loading", void 0);
__decorate([State], Action.prototype, "error", void 0);
Action = __decorate([ViewModel], Action);

/**
 * 分组容器，将多个 {@link SideMenu} 或菜单项归为一组。
 */
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !isVNode(s);
}
function SideMenuGroup() {
  const children = useChildren();
  return createVNode("div", {
    "class": "sidebar-group"
  }, [children]);
}

/**
 * SideMenu 组件的属性接口。
 */

/** 视图实现，请直接使用 {@link SideMenu}。 */
function SideMenuView(props) {
  const children = useChildren();
  if (props.inSubMenu) {
    return createVNode("div", {
      "class": "sidebar-collapsible"
    }, [createVNode("ul", {
      "class": "sidebar-submenu"
    }, [children])]);
  }
  return createVNode("ul", {
    "class": "sidebar-menu"
  }, [children]);
}

/** 视图模型，请直接使用 {@link SideMenu}。 */
let SideMenuVM = class SideMenuVM {
  static {
    this.prototype.sideMenu = undefined;
  }
  /** @internal */
  get inSubMenu() {
    return this.sideMenu !== undefined;
  }
};
__decorate([Inject], SideMenuVM.prototype, "sideMenu", void 0);
__decorate([Provide, Computed], SideMenuVM.prototype, "inSubMenu", null);
SideMenuVM = __decorate([ViewModel, Provide('sideMenu')], SideMenuVM);
/**
 * 侧边栏菜单容器，用于包裹 {@link SideMenuItem}。
 *
 * 可嵌套使用以形成多级子菜单，嵌套时自动切换为子菜单样式。
 *
 * @example
 * ```tsx
 * <SideMenu>
 *   <SideMenuItem label="首页" icon="home" href="/" />
 *   <SideMenuItem label="设置" icon="cog">
 *     <SideMenu>
 *       <SideMenuItem label="通用" href="/settings/general" />
 *       <SideMenuItem label="安全" href="/settings/security" />
 *     </SideMenu>
 *   </SideMenuItem>
 * </SideMenu>
 * ```
 */
const SideMenu = createComponent(SideMenuView, SideMenuVM);

/**
 * {@link SideMenuItem} 的属性。
 */

function SideMenuItemView(props) {
  const {
    label,
    icon,
    href,
    target
  } = props;
  const children = useChildren();
  const hasChildren = children && children.length;
  const onClick = hasChildren ? props.toggleCollapsed : props.onClick ? props.handleClick : undefined;
  const classList = ["sidebar-item"];
  if (props.collapsed) {
    classList.push("collapsed");
  }
  if (props.inSubMenu) {
    return createVNode("li", {
      "class": classList.join(" ")
    }, [createVNode("a", {
      "href": href,
      "target": target,
      "onClick": onClick
    }, [hasChildren ? createVNode("i", {
      "class": "sidebar-indicator"
    }, null) : null, icon ? createVNode(Icon, {
      "fw": true,
      "position": "left"
    }, _isSlot(icon) ? icon : {
      default: () => [icon]
    }) : null, createVNode("span", {
      "class": "valign-middle"
    }, [label])]), children]);
  }
  return createVNode("li", {
    "class": classList.join(" ")
  }, [createVNode("a", {
    "class": "sidebar-link",
    "href": href,
    "target": target,
    "title": label,
    "onClick": onClick
  }, [icon ? createVNode(Icon, {
    "class": "sidebar-icon"
  }, _isSlot(icon) ? icon : {
    default: () => [icon]
  }) : null, hasChildren ? createVNode("i", {
    "class": "sidebar-indicator"
  }, null) : null, createVNode("span", {
    "class": "sidebar-label"
  }, [label])]), children]);
}
let SideMenuItemVM = class SideMenuItemVM {
  static {
    this.prototype.inSubMenu = undefined;
    this.prototype.label = undefined;
    this.prototype.icon = undefined;
    this.prototype.href = undefined;
    this.prototype.target = undefined;
    this.prototype.action = undefined;
    this.prototype.onClick = undefined;
    this.prototype.collapsed = undefined;
  }
  /** @internal */
  /** @internal */
  /** @internal */
  /** @internal */
  /** @internal */
  action = use(Action);
  collapsed = true;
  handleClick(e) {
    if (this.onClick) {
      e.preventDefault();
      if (this.action.loading) return;
      this.action.execute(this.onClick, [{
        event: e,
        component: this
      }]);
    }
  }
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
};
__decorate([Inject], SideMenuItemVM.prototype, "inSubMenu", void 0);
__decorate([Prop], SideMenuItemVM.prototype, "label", void 0);
__decorate([Prop], SideMenuItemVM.prototype, "icon", void 0);
__decorate([Prop], SideMenuItemVM.prototype, "href", void 0);
__decorate([Prop], SideMenuItemVM.prototype, "target", void 0);
__decorate([Prop], SideMenuItemVM.prototype, "onClick", void 0);
__decorate([State], SideMenuItemVM.prototype, "collapsed", void 0);
SideMenuItemVM = __decorate([ViewModel], SideMenuItemVM);
/**
 * 侧边栏菜单项，需作为 {@link SideMenu} 的子级使用。
 *
 * 传入子节点即视为可展开项，会自动显示折叠指示箭头。
 *
 * @example
 * ```tsx
 * // 普通链接项
 * <SideMenuItem label="首页" icon="home" href="/" />
 *
 * // 可展开项（带子菜单）
 * <SideMenuItem label="设置" icon="cog">
 *   <SideMenu>...</SideMenu>
 * </SideMenuItem>
 * ```
 */
const SideMenuItem = createComponent(SideMenuItemView, SideMenuItemVM);

export { SideMenuGroup as S, SideMenuView as a, SideMenuVM as b, SideMenu as c, SideMenuItemView as d, SideMenuItemVM as e, SideMenuItem as f };
