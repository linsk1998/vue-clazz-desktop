import { createComponent, Prop, Provide, useChildren, ViewModel } from "vue-clazz-decorator";

export type FormLayout = 'inline' | 'vertical' | 'horizontal';

/** 表单参数 */
export interface FormProps {
	/** 原生 action 属性 */
	action?: string;
	/** 布局方式 */
	layout?: FormLayout;
	/** 样式类 */
	class?: string;
	/** 是否禁用 */
	disabled?: boolean;
	/** 原生 noValidate 属性 */
	noValidate?: boolean;
	/** 提交事件 */
	onSubmit?: (event: SubmitEvent) => any;
}

@ViewModel
export class FormVM {
	@Prop('class')
	public className?: string;
	@Prop
	public action?: string;
	@Prop
	@Provide('formLayout')
	public layout?: FormLayout;
	@Prop
	@Provide
	public disabled?: boolean;
	@Prop
	public noValidate?: boolean;
	@Prop
	public onSubmit?: (event: SubmitEvent) => any;
}

export function FormView(props: FormVM) {
	var { className, action, noValidate, onSubmit, layout } = props;
	var classList: string[] = [];
	if(className) {
		classList.push(className);
	} else {
		switch(layout) {
			case "inline":
				classList.push("form-inline");
				break;
			case "horizontal":
				classList.push("form-horizontal");
				break;
			default:
				classList.push("form");
		}
	}
	const children = useChildren();
	return <form class={classList.join(" ")} action={action} novalidate={noValidate} onSubmit={onSubmit}>{children}</form>;
}

/** 表单
 * @remarks
 * 表单布局容器，支持垂直、水平、内联三种布局，通过上下文向 FormItem 传递布局方式。
 * @example
 * ```tsx
 * <Form layout="horizontal">
 * 	<FormItem label="名称"><input class="form-control" /></FormItem>
 * </Form>
 * ```
 */
export const Form = createComponent<FormProps, FormVM>(FormView, FormVM);
