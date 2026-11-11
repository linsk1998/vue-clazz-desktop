import type { CSSProperties } from "vue";
import { createComponent, Prop, Provide, useChildren, ViewModel } from "vue-clazz-decorator";

export const gutterSize: (number | string)[] = [0, 'xs', 'sm', 'md', 'lg', 'xl'];
export type GutterSize = number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** 栅格布局之横向的参数 */
export interface RowProps {
	/** 区块间隔 */
	gutter?: GutterSize;
	/** 样式类 */
	class?: string;
	/** 样式 */
	style?: CSSProperties;
}

@ViewModel
export class RowVM {
	@Prop('class')
	public className?: string;
	@Prop
	public style?: CSSProperties;
	@Prop
	@Provide('gutter')
	public gutter?: GutterSize;
}

export function RowView(props: RowVM) {
	var { className, style, gutter } = props;
	var classList = ["row"];
	if(className) {
		classList.push(className);
	}
	var style2: CSSProperties = {};
	var index = gutterSize.indexOf(gutter);
	if(index > 0) {
		classList.push("row-gx-" + index);
	} else if(typeof gutter === 'number') {
		style2.marginLeft = gutter;
	}
	if(style) {
		Object.assign(style2, style);
	}
	var children = useChildren();
	return <div class={classList.join(" ")} style={style2}>{children}</div>;
}

/** 栅格布局之横向
 * @remarks
 * 12 栅格系统的行容器，通过 `gutter` 控制列间距，并向 Col 注入间隔上下文。
 * @example
 * ```tsx
 * <Row gutter="lg">
 * 	<Col span={6}>左</Col>
 * 	<Col span={6}>右</Col>
 * </Row>
 * ```
 */
export const Row = createComponent<RowProps, RowVM>(RowView, RowVM);
