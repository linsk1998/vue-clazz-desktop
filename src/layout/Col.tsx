import type { CSSProperties } from "vue";
import { createComponent, Inject, Prop, useChildren, ViewModel } from "vue-clazz-decorator";
import { gutterSize, type GutterSize } from "./Row";

/** 栅格布局之竖向的参数 */
export interface ColProps {
	/** 占位格数 */
	span?: number;
	/** 栅格左侧的间隔格数，间隔内不可以有栅格 */
	offset?: number;
	/** 栅格向右移动格数 */
	push?: number;
	/** 栅格向左移动格数 */
	pull?: number;
	/** 样式类 */
	class?: string;
	/** 样式 */
	style?: CSSProperties;
}

@ViewModel
export class ColVM {
	@Prop('class')
	public className?: string;
	@Prop
	public style?: CSSProperties;
	@Prop
	public span?: number;
	@Prop
	public offset?: number;
	@Prop
	public push?: number;
	@Prop
	public pull?: number;
	@Inject('gutter')
	public gutter?: GutterSize;
}

export function ColView(props: ColVM) {
	var { className, style, span, offset, push, pull, gutter } = props;
	var classList = ["col"];
	if(span) {
		classList.push('col-' + span);
	}
	if(offset) {
		classList.push('col-offset-' + offset);
	}
	if(push) {
		classList.push('col-push-' + push);
	}
	if(pull) {
		classList.push('col-pull-' + pull);
	}
	if(className) {
		classList.push(className);
	}
	var style2: CSSProperties = {};
	var index = gutterSize.indexOf(gutter);
	if(index > 0) {
		classList.push("col-gx-" + index);
	} else if(typeof gutter === 'number') {
		style2.paddingLeft = gutter;
	}
	if(style) {
		Object.assign(style2, style);
	}
	var children = useChildren();
	return <div class={classList.join(" ")} style={style2}>{children}</div>;
}

/** 栅格布局之竖向
 * @remarks
 * 12 栅格系统的列容器，通过 `span`/`offset`/`push`/`pull` 控制占位与位移，自动接收 Row 的 `gutter` 间隔。
 * @example
 * ```tsx
 * <Row>
 * 	<Col span={6} offset={3}>居中</Col>
 * </Row>
 * ```
 */
export const Col = createComponent<ColProps, ColVM>(ColView, ColVM);
