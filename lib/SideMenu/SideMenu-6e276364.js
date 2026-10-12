import { createVNode, isVNode } from 'vue';
import _applyDecs from '@babel/runtime/helpers/esm/applyDecs2311';
import { ViewModel, State, Provide, Inject, Computed, createComponent, Prop, use, useChildren } from 'vue-clazz-decorator';
import { I as Icon } from '../Icon/Icon-66d21ba0.js';

let _initClass$1, _init_loading, _init_extra_loading, _init_error, _init_extra_error;
let _Action;
class Action {
  static {
    ({
      e: [_init_loading, _init_extra_loading, _init_error, _init_extra_error],
      c: [_Action, _initClass$1]
    } = _applyDecs(this, [ViewModel], [[State, 0, "loading"], [State, 0, "error"]]));
  }
  constructor() {
    _init_extra_error(this);
  }
  loading = _init_loading(this, false);
  error = (_init_extra_loading(this), _init_error(this, null));
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
  static {
    _initClass$1();
  }
}

let _initProto, _initClass, _init_sideMenu, _init_extra_sideMenu, _initClass2, _init_inSubMenu, _init_extra_inSubMenu, _init_label, _init_extra_label, _init_icon, _init_extra_icon, _init_href, _init_extra_href, _init_target, _init_extra_target, _init_onClick, _init_extra_onClick, _init_collapsed, _init_extra_collapsed;

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
let _SideMenuVM;
class SideMenuVM {
  static {
    ({
      e: [_init_sideMenu, _init_extra_sideMenu, _initProto],
      c: [_SideMenuVM, _initClass]
    } = _applyDecs(this, [ViewModel, Provide('sideMenu')], [[Inject, 0, "sideMenu"], [[Provide, Computed], 3, "inSubMenu"]]));
  }
  constructor() {
    _init_extra_sideMenu(this);
  }
  sideMenu = (_initProto(this), _init_sideMenu(this));

  /** @internal */
  get inSubMenu() {
    return this.sideMenu !== undefined;
  }
  static {
    _initClass();
  }
}
const SideMenu = createComponent(SideMenuView, _SideMenuVM);

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
let _SideMenuItemVM;
class SideMenuItemVM {
  static {
    ({
      e: [_init_inSubMenu, _init_extra_inSubMenu, _init_label, _init_extra_label, _init_icon, _init_extra_icon, _init_href, _init_extra_href, _init_target, _init_extra_target, _init_onClick, _init_extra_onClick, _init_collapsed, _init_extra_collapsed],
      c: [_SideMenuItemVM, _initClass2]
    } = _applyDecs(this, [ViewModel], [[Inject, 0, "inSubMenu"], [Prop, 0, "label"], [Prop, 0, "icon"], [Prop, 0, "href"], [Prop, 0, "target"], [Prop, 0, "onClick"], [State, 0, "collapsed"]]));
  }
  constructor() {
    _init_extra_collapsed(this);
  }
  /** @internal */
  inSubMenu = _init_inSubMenu(this);
  /** @internal */
  label = (_init_extra_inSubMenu(this), _init_label(this));
  /** @internal */
  icon = (_init_extra_label(this), _init_icon(this));
  /** @internal */
  href = (_init_extra_icon(this), _init_href(this));
  /** @internal */
  target = (_init_extra_href(this), _init_target(this));
  action = (_init_extra_target(this), use(_Action));
  onClick = _init_onClick(this);
  collapsed = (_init_extra_onClick(this), _init_collapsed(this, true));
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
  static {
    _initClass2();
  }
}
const SideMenuItem = createComponent(SideMenuItemView, _SideMenuItemVM);

export { SideMenuGroup as S, _SideMenuVM as _, SideMenuView as a, SideMenu as b, SideMenuItemView as c, _SideMenuItemVM as d, SideMenuItem as e };
