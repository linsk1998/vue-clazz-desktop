import type { CSSProperties, VNode } from "vue";
import { createComponent, Inject, Prop, useChildren, ViewModel } from "vue-clazz-decorator";
import type { FormLayout } from "./Form";

/** 表单项参数 */
export interface FormItemProps {
	/** 标签文本 */
	label?: string | VNode;
	/** 标签宽度 */
	labelWidth?: string | number;
	/** 标签对齐 */
	labelAlign?: 'left' | 'center' | 'right';
	/** 是否显示必填样式 */
	required?: boolean;
	/** 是否显示校验通过样式 */
	hasInvalid?: boolean;
	/** 是否显示反馈图标 */
	hasFeedbackIcon?: boolean;
}

@ViewModel
export class FormItemVM {
	@Prop
	public label?: string | VNode;
	@Prop
	public labelWidth?: string | number;
	@Prop
	public labelAlign?: 'left' | 'center' | 'right';
	@Prop
	public hasInvalid?: boolean;
	@Prop
	public hasFeedbackIcon?: boolean;
	@Inject('formLayout')
	public layout?: FormLayout;
}

export function FormItemView(props: FormItemVM) {
	var { label, labelWidth, labelAlign, hasInvalid, hasFeedbackIcon, layout } = props;
	var classList = ["form-group"];
	if(hasInvalid) {
		classList.push("has-invalid");
	}
	if(hasFeedbackIcon) {
		classList.push("has-feedback");
	}
	const children = useChildren();
	if(layout === "inline") {
		var labelStyle: CSSProperties = {};
		if(labelWidth != null) {
			labelStyle.width = labelWidth;
		}
		if(labelAlign) {
			labelStyle.textAlign = labelAlign;
		}
		return <div class={classList.join(" ")}>
			<label class="form-label control-label inline-block" style={labelStyle}>{label}</label>
			{children}
		</div>;
	}
	if(layout === "horizontal") {
		var groupStyle: CSSProperties = {};
		var lstyle: CSSProperties = {};
		if(labelWidth != null) {
			groupStyle.paddingLeft = labelWidth;
			lstyle.width = labelWidth;
			lstyle.marginLeft = '-' + labelWidth;
		}
		if(labelAlign) {
			lstyle.textAlign = labelAlign;
		}
		return <div class={classList.join(" ")} style={groupStyle}>
			<label class="form-label control-label" style={lstyle}>{label}</label>
			{children}
		</div>;
	}
	var vlabelStyle: CSSProperties = {};
	if(labelAlign) {
		vlabelStyle.textAlign = labelAlign;
	}
	return <div class={classList.join(" ")}>
		<label class="form-label control-label" style={vlabelStyle}>{label}</label>
		{children}
	</div>;
}

/** 表单项
 * @remarks
 * 表单字段单元，根据上层 Form 的布局渲染标签与控件。
 * @example
 * ```tsx
 * <FormItem label="名称"><input class="form-control" /></FormItem>
 * ```
 */
export const FormItem = createComponent<FormItemProps, FormItemVM>(FormItemView, FormItemVM);
