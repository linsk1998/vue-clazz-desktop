import { createVNode } from 'vue';
import { useChildren } from 'vue-clazz-decorator';

/** @internal 默认渲染实现，可通过 {@link iconSetup} 替换。 */
var renderIcon = function (iconName, className, arialabel) {
  return createVNode("i", {
    "class": className + ' fa fa-' + iconName,
    "aria-hidden": "true",
    "aria-label": arialabel || iconName
  }, null);
};

/**
 * {@link iconSetup} 的配置项。
 */

/**
 * 全局配置 {@link Icon} 的渲染方式，用于替换默认的 Font Awesome 实现。
 *
 * @example
 * ```ts
 * iconSetup({
 *   renderIcon(name, cls) {
 *     return <i class={`${cls} iconfont icon-${name}`} />;
 *   }
 * });
 * ```
 */
function iconSetup(settings) {
  if (settings.renderIcon) renderIcon = settings.renderIcon;
}

/**
 * {@link Icon} 的属性。
 */

/**
 * 图标组件，默认基于 Font Awesome 图标名渲染。
 *
 * 图标名通过子节点文本传入。
 *
 * @example
 * ```tsx
 * <Icon>home</Icon>              // 普通图标
 * <Icon size="2x">star</Icon>    // 放大 2 倍
 * <Icon spin>spinner</Icon>      // 旋转动画
 * <Icon rotate={90}>arrow</Icon> // 旋转 90°
 * ```
 */
function Icon(props) {
  const {
    fw,
    position,
    size,
    rotate,
    flip,
    spin,
    'aria-label': arialabel
  } = props;
  const children = useChildren();
  let classList = ["icon"];
  if (fw) classList.push("icon-fw");
  if (position) classList.push("icon-" + position);
  if (size) classList.push("icon-" + size);
  if (rotate) classList.push("icon-rotate-" + rotate);
  if (flip) classList.push("icon-flip-" + flip);
  if (spin) {
    if (spin == "pulse") {
      classList.push("icon-pulse");
    } else {
      classList.push("icon-spin");
    }
  }
  return renderIcon(children[0].children, classList.join(' '), arialabel);
}

export { Icon as I, iconSetup as i };
