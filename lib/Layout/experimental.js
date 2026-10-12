import { createVNode, createTextVNode, h } from 'vue';
import { useChildren } from 'vue-clazz-decorator';
import { Aside } from '../Aside/experimental.js';
import { Content } from '../Content/experimental.js';
import { Header } from '../Header/experimental.js';

const orderMap = new Map([[Aside, -1], [Content, 1], [Layout, 1]]);
const MARGIN_LEVEL = {
  'xs': "1",
  'sm': "2",
  'md': "3",
  'lg': "4",
  'xl': "5"
};

/** Layout 布局的参数 */

/** 合并 class 与额外 class，返回新 props 对象 */
function withClass(child, extraClass) {
  var origin = child.props?.class;
  var merged = origin ? origin + " " + extraClass : extraClass;
  return h(child.type, {
    ...child.props,
    class: merged,
    key: child.key
  }, child.children);
}

/** 合并 class 与 style，返回新 props 对象 */
function withClassStyle(child, extraClass, extraStyle) {
  var origin = child.props?.class;
  var merged = origin ? origin + " " + extraClass : extraClass;
  var mergedStyle = {
    ...(child.props?.style || {}),
    ...extraStyle
  };
  return h(child.type, {
    ...child.props,
    class: merged,
    style: mergedStyle,
    key: child.key
  }, child.children);
}

/** 布局-整体
 * @remarks
 * 布局容器，其下可嵌套 Header Aside Content Footer 或 Layout 本身，可以放在任何父容器中。
 * @example
 * ```tsx
 * import { Layout, Header, Content } from "@ting-ui/vue-desktop"
 * <Layout fill>
 * 	<Header>顶栏</Header>
 * 	<Content>内容</Content>
 * </Layout>
 * ```
 */
function Layout(props) {
  var classList = [];
  var {
    fill
  } = props;
  if (fill) {
    classList.push("layout-full");
  }
  var children = (useChildren() || []).filter(c => c && typeof c.type !== "symbol");
  /** 方向垂直 */
  var layoutV = false;
  /** 方向水平 */
  var layoutH = false;
  for (let item of children) {
    if (item.type === Header) {
      layoutV = true;
    } else if (item.type === Aside) {
      layoutH = true;
    }
  }
  if (!layoutV && !layoutH) {
    if (import.meta.env.DEV) {
      classList.push("text-danger");
      return createVNode("div", {
        "class": classList.join(" ")
      }, [createTextVNode("\u5E03\u5C40\u9519\u8BEF\uFF1A\u7F3A\u5C11\u9876\u680F\u6216\u5E95\u680F\u6216\u4FA7\u680F")]);
    }
    return createVNode("div", {
      "class": classList.join(" ")
    }, [children]);
  } else if (layoutV && layoutH) {
    if (import.meta.env.DEV) {
      classList.push("text-danger");
      return createVNode("div", {
        "class": classList.join(" ")
      }, [createTextVNode("\u5E03\u5C40\u9519\u8BEF\uFF1A\u4FA7\u680F\u4E0D\u80FD\u548C\u9876\u680F\u6216\u5E95\u680F\u540C\u65F6\u51FA\u73B0")]);
    }
    return createVNode("div", {
      "class": classList.join(" ")
    }, [children]);
  } else if (layoutV) {
    classList.push("col-flex");
    let items = children.map(item => {
      if (item.type === Layout) {
        return withClass(item, "row-grow");
      } else if (item.type === Content) {
        return withClass(item, "row-grow");
      } else if (item.type === Header) {
        return item;
      }
      return null;
    }).filter(Boolean);
    return createVNode("div", {
      "class": classList.join(" "),
      "style": props.style
    }, [items]);
  } else if (layoutH) {
    classList.push("row-flex");
    let hasContent = false;
    let items = children.map(item => {
      if (item.type === Layout) {
        hasContent = true;
        return withClass(item, "col-center");
      } else if (item.type === Content) {
        hasContent = true;
        return withClass(item, "col-center");
      } else if (item.type === Aside) {
        let gutter = props.gutter;
        let extraClass;
        let extraStyle = {};
        if (hasContent) {
          extraClass = "col-right";
          if (gutter) {
            if (typeof gutter === "number") {
              extraStyle.marginLeft = gutter;
            } else {
              extraClass += " ml-" + MARGIN_LEVEL[gutter];
            }
          }
        } else {
          extraClass = "col-left";
          if (gutter) {
            if (typeof gutter === "number") {
              extraStyle.marginRight = gutter;
            } else {
              extraClass += " mr-" + MARGIN_LEVEL[gutter];
            }
          }
        }
        return withClassStyle(item, extraClass, extraStyle);
      }
      return null;
    }).filter(Boolean);
    items.sort((a, b) => orderMap.get(a.type) - orderMap.get(b.type));
    return createVNode("div", {
      "class": classList.join(" "),
      "style": props.style
    }, [items]);
  }
}

export { Layout, Layout as default };
