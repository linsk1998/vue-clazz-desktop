import type { CSSProperties } from "vue";
import { createComponent, Inject, Prop, useChildren, ViewModel } from "vue-clazz-decorator";
import { countLength } from "../utils/string/count";
import type { TextEditorType } from "./TextInput";

/** 文本域参数 */
export interface TextAreaProps {
	/** 原生 name 属性 */
	name?: string;
	/** 文本类型 */
	type?: TextEditorType;
	/** 占位提示 */
	placeholder?: string;
	/** 宽度 */
	width?: number;
	/** 变化回调 */
	onChange?: (value: string) => any;
	/** 失焦回调 */
	onBlur?: (e: FocusEvent) => any;
	/** 聚焦回调 */
	onFocus?: (e: FocusEvent) => any;
	/** 受控值 */
	value?: string;
	/** 是否禁用 */
	disabled?: boolean;
	/** 行数 */
	rows?: number;
	/** 最大长度 */
	maxCount?: number;
	/** 是否显示输入字数统计 */
	showCount?: boolean;
	/** 字数统计策略 */
	calcCount?: (text: string) => number;
	/** 样式类 */
	class?: string;
	/** 样式 */
	style?: CSSProperties;
}

@ViewModel
export class TextAreaVM {
	@Prop('class')
	public className?: string;
	@Prop
	style?: CSSProperties;
	@Prop
	public name?: string;
	@Prop
	public type?: TextEditorType;
	@Prop
	public placeholder?: string;
	@Prop
	public width?: number;
	@Prop
	public onChange?: (value: string) => any;
	@Prop
	public onBlur?: (e: FocusEvent) => any;
	@Prop
	public onFocus?: (e: FocusEvent) => any;
	@Prop
	public value?: string;
	@Prop
	public disabled?: boolean;
	@Prop
	public rows?: number;
	@Prop
	public maxCount?: number;
	@Prop
	public showCount?: boolean;
	@Prop
	public calcCount?: (text: string) => number = countLength;
	@Inject('disabled')
	private contextDisabled?: boolean;

	public get isDisabled(): boolean {
		return !!this.disabled || !!this.contextDisabled;
	}

	public handleFocus(e: FocusEvent) {
		this.onFocus?.(e);
	}
	public handleBlur(e: FocusEvent) {
		this.onBlur?.(e);
	}
	public handleChange(e: Event) {
		this.onChange?.((e.target as HTMLTextAreaElement).value);
	}
}

export function TextAreaView(this: unknown, props: TextAreaVM) {
	var { className, style, value, width, name, placeholder, rows, maxCount, showCount, isDisabled, handleFocus, handleBlur, handleChange } = props;
	var strValue = value == null ? "" : String(value);
	var classList = ["textarea"];
	if(className) {
		classList.push(className);
	}
	if(isDisabled) {
		classList.push("textarea-disabled");
	}
	var valueCount = 0;
	if(showCount) {
		valueCount = props.calcCount(strValue);
	}
	const children = useChildren();
	return <>
		<div class={classList.join(" ")} style={{ width: width, ...style }}>
			<textarea
				name={name}
				value={strValue}
				disabled={isDisabled}
				placeholder={placeholder}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				rows={rows}
			/>
			{showCount ?
				<span class={"textarea-counter" + (maxCount && maxCount < valueCount ? " text-danger" : "")}>
					{valueCount + (maxCount ? '/' + maxCount : '')}
				</span> :
				null
			}
		</div>
		{children}
	</>;
}

/** 文本域
 * @remarks
 * 受控多行文本输入，支持行数、字数统计与禁用。
 * @example
 * ```tsx
 * <TextArea value={text} onChange={v => text = v} rows={3} />
 * ```
 */
export const TextArea = createComponent<TextAreaProps, TextAreaVM>(TextAreaView, TextAreaVM);
