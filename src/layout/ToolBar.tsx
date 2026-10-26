import type { CSSProperties } from "vue";
import { useChildren } from "vue-clazz-decorator";

/** 按钮工具栏的参数 */
export interface ToolBarProps {
	/** 自定义样式类 */
	class?: string;
	/** 样式 */
	style?: CSSProperties;
	/** 对齐方式 */
	align?: 'center' | 'right' | 'left';
}

/** 按钮工具栏
 * @remarks
 * 用于将多个按钮或按钮组横向排列组合在一起，其下可嵌套任意按钮元素。
 * @example
 * ```tsx
 * import { ToolBar, Button } from "@ting-ui/vue-desktop"
 * <ToolBar>
 * 	<Button type="primary">保存</Button>
 * 	<Button>取消</Button>
 * </ToolBar>
 * ```
 */
export function ToolBar(props: ToolBarProps) {
	var { class: className, style, align } = props;
	var classList = ["btn-toolbar", "clearfix"];
	if(className) {
		classList.push(className);
	}
	if(align) {
		if(style) {
			style = { ...style, textAlign: align };
		} else {
			style = { textAlign: align };
		}
	}
	const children = useChildren();
	return <div class={classList.join(" ")} style={style}>{children}</div>;
}
