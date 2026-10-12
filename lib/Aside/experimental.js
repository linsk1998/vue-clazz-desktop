import { createVNode } from 'vue';
import { useChildren } from 'vue-clazz-decorator';

/** 侧边栏的参数 */

/** 布局-侧边
 * @remarks
 * 侧边栏，自带默认样式及基本功能，其下可嵌套任何元素，只能放在 Layout 中。
 * @example
 * ```tsx
 * import { Layout, Aside } from "@ting-ui/vue-desktop"
 * <Layout>
 * 	<Aside width={200}>Aside</Aside>
 * </Layout>
 * ```
 */
function Aside(props) {
  var {
    scrollX,
    scrollY,
    width
  } = props;
  var classList = ["col-aside"];
  if (scrollX) {
    classList.push("overflow-x-auto");
  }
  if (scrollY) {
    classList.push("overflow-y-auto");
  }
  const children = useChildren();
  return createVNode("div", {
    "class": classList.join(" "),
    "style": width ? {
      width
    } : null
  }, [children]);
}

export { Aside, Aside as default };
