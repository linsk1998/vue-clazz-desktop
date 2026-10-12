import { createVNode } from 'vue';
import { useChildren } from 'vue-clazz-decorator';

/** 内容部分的参数 */

/** 布局-中间部分
 * @remarks
 * 内容部分，自带默认样式，其下可嵌套任何元素，只能放在 Layout 中。
 * @example
 * ```tsx
 * import { Layout, Content } from "@ting-ui/vue-desktop"
 * <Layout>
 * 	<Content>Content</Content>
 * </Layout>
 * ```
 */
function Content(props) {
  var {
    scrollX,
    scrollY
  } = props;
  var classList = [];
  if (scrollX) {
    classList.push("overflow-x-auto");
  }
  if (scrollY) {
    classList.push("overflow-y-auto");
  }
  const children = useChildren();
  return createVNode("div", {
    "class": classList.join(" ")
  }, [children]);
}

export { Content, Content as default };
