import { createVNode, mergeProps } from 'vue';
import { useChildren } from 'vue-clazz-decorator';

/** 空白按钮参数 */

/** 空白按钮
 * @remarks
 * 空白按钮根据业务需要进行调整，可以放置各种按钮，比如：图片。
 * @example
 * ```tsx
 * <PlainButton className="home-menu-btn" onClick={this.onJdClick}>
 * 		<img src={require("@/assets/images/ddtj.png")} />
 * </PlainButton>
 * ```
 */
function PlainButton(props) {
  var {
    title,
    disabled
  } = props;
  var children = useChildren();
  var classList = [];
  if (disabled) {
    classList.push('disabled');
  }
  return createVNode("a", mergeProps(props, {
    "href": "javascript:void 0",
    "draggable": false,
    "class": classList.join(' '),
    "title": title
  }), [children]);
}

export { PlainButton, PlainButton as default };
