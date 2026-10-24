import type { CSSProperties } from "vue";
import { useChildren } from "vue-clazz-decorator";

/** @internal 默认渲染实现，可通过 {@link iconSetup} 替换。 */
var renderIcon = function(iconName: string, className: string, style: CSSProperties, arialabel?: string) {
	return <i key={iconName} class={className + ' fa fa-' + iconName} style={style} aria-hidden="true" aria-label={arialabel || iconName} />;
};

/**
 * {@link iconSetup} 的配置项。
 */
export interface IconSettings {
	/** 自定义图标渲染函数，接收 `(图标名, 类名, aria-label)` */
	renderIcon?: typeof renderIcon;
}

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
export function iconSetup(settings: IconSettings) {
	if(settings.renderIcon) renderIcon = settings.renderIcon;
}

/**
 * {@link Icon} 的属性。
 */
export interface IconProps {
	/** 附加类名 */
	class?: string;
	/** 内联样式 */
	style?: CSSProperties;
	/** 图标靠左 / 靠右排列 */
	position?: 'left' | 'right';
	/** 放大倍率，`'2x'` 即 2 倍大小，以此类推 */
	size?: 'lg' | '2x' | '3x' | '4x' | '5x';
	/** 旋转角度 */
	rotate?: -90 | 90 | 180 | 270;
	/** 水平 / 垂直翻转 */
	flip?: 'horizontal' | 'vertical';
	/** 旋转动画：`true` 匀速旋转，`'pulse'` 八帧脉冲 */
	spin?: boolean | 'pulse';
	/** 固定宽度 */
	fw?: boolean;
	/** 无障碍标签，省略时使用图标名 */
	'aria-label'?: string;
}

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
export function Icon(props: IconProps) {
	const { class: className, style, fw, position, size, rotate, flip, spin, 'aria-label': arialabel } = props;
	const children = useChildren();
	let classList = ["icon"];
	if(className) classList.push(className);
	if(fw) classList.push("icon-fw");
	if(position) classList.push("icon-" + position);
	if(size) classList.push("icon-" + size);
	if(rotate) classList.push("icon-rotate-" + rotate);
	if(flip) classList.push("icon-flip-" + flip);
	if(spin) {
		if(spin == "pulse") {
			classList.push("icon-pulse");
		} else {
			classList.push("icon-spin");
		}
	}
	return renderIcon(children[0].children as string, classList.join(' '), style, arialabel);
}
