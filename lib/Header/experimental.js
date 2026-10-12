import { createVNode } from 'vue';
import { useChildren } from 'vue-clazz-decorator';

/** 顶部布局的参数 */

/** 布局-顶部
 * @remarks
 * 顶部布局，自带默认样式，其下可嵌套任何元素，只能放在 Layout 中。
 * @example
 * ```tsx
 * import { Layout, Header } from "@ting-ui/vue-desktop"
 * <Layout>
 * 	<Header>Header</Header>
 * </Layout>
 * ```
 */
function Header(props) {
  var {
    scrollX,
    scrollY,
    height
  } = props;
  var classList = ["row-shrink"];
  if (scrollX) {
    classList.push("overflow-x-auto");
  }
  if (scrollY) {
    classList.push("overflow-y-auto");
  }
  const children = useChildren();
  return createVNode("div", {
    "class": classList.join(" "),
    "style": height ? {
      height
    } : null
  }, [children]);
}

export { Header, Header as default };
