import type { CSSProperties, VNode } from "vue";
import { createComponent, Inject, Prop, useChildren, ViewModel } from "vue-clazz-decorator";
import { countLength } from "../utils/string/count";

export type TextEditorType = 'text' | 'password' | 'tel' | 'url' | 'email' | 'number';

/** 文本输入框参数 */
export interface TextInputProps {
	/** 原生 name 属性 */
	name?: string;
	/** 占位提示 */
	placeholder?: string;
	/** 宽度 */
	width?: number;
	/** 变化回调 */
	onChange?: (value: string | null) => any;
	/** 失焦回调 */
	onBlur?: (e: FocusEvent) => any;
	/** 聚焦回调 */
	onFocus?: (e: FocusEvent) => any;
	/** 受控值 */
	value?: string;
	/** 是否禁用 */
	disabled?: boolean;
	/** 是否可清空 */
	clearable?: boolean;
	/** 文本类型 */
	type?: TextEditorType;
	/** 最大长度 */
	maxCount?: number;
	/** 是否显示输入字数统计 */
	showCount?: boolean;
	/** 字数统计策略 */
	calcCount?: (text: string) => number;
	/** 前缀 */
	prefix?: string;
	/** 后缀 */
	suffix?: string;
	/** 输入框前置内容 */
	prepend?: string;
	/** 输入框后置内容 */
	append?: string;
	/** 文本框最大长度 */
	maxlength?: number;
	/** 样式类 */
	class?: string;
	/** 样式 */
	style?: CSSProperties;
}

@ViewModel
export class TextInputVM {
	@Prop('class')
	public className?: string;
	@Prop
	style?: CSSProperties;
	@Prop
	public name?: string;
	@Prop
	public placeholder?: string;
	@Prop
	public width?: number;
	@Prop
	public onChange?: (value: string | null) => any;
	@Prop
	public onBlur?: (e: FocusEvent) => any;
	@Prop
	public onFocus?: (e: FocusEvent) => any;
	@Prop
	public value?: string;
	@Prop
	public disabled?: boolean;
	@Prop
	public clearable?: boolean;
	@Prop
	public type?: TextEditorType;
	@Prop
	public maxCount?: number;
	@Prop
	public showCount?: boolean;
	@Prop
	public calcCount?: (text: string) => number = countLength;
	@Prop
	public prefix?: string;
	@Prop
	public suffix?: string;
	@Prop
	public prepend?: string;
	@Prop
	public append?: string;
	@Prop
	public maxlength?: number;
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
		this.onChange?.((e.target as HTMLInputElement).value);
	}
	public handleClear() {
		this.onChange?.(null);
	}
}

export function TextInputView(this: unknown, props: TextInputVM) {
	var { className, style, value, width, name, placeholder, clearable, type, maxCount, showCount, prefix, suffix, prepend, append, maxlength, isDisabled, handleFocus, handleBlur, handleChange, handleClear } = props;
	var strValue = value == null ? "" : String(value);
	var valueCount = showCount ? props.calcCount(strValue) : 0;
	var hasFix = maxCount || showCount || prefix || suffix;
	var classList = ["input"];
	if(className) {
		classList.push(className);
	}
	if(isDisabled) {
		classList.push("input-disabled");
	}

	const children = useChildren();
	var inner: VNode;
	if(hasFix) {
		inner = <div class={classList.join(" ")} style={style}>
			{prefix ?
				<div class="input-prefix">
					<span class="valign-middle">{prefix}</span>
					<span class="valign-sibling"></span>
				</div> :
				null
			}
			{suffix || showCount ?
				<div class="input-suffix">
					<span class="valign-sibling"></span>
					<span class="valign-middle">{suffix}</span>
					{showCount ?
						<span class={"input-counter" + (maxCount && maxCount < valueCount ? " text-danger" : "")}>
							{valueCount + (maxCount ? '/' + maxCount : '')}
						</span> :
						null
					}
				</div> :
				null
			}
			<div class="input-body">
				<input
					name={name}
					type={type}
					value={strValue}
					disabled={isDisabled}
					placeholder={placeholder}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					maxlength={maxlength}
				/>
				{clearable && strValue && !isDisabled ? <i class="control-clear fa fa-times-circle" onClick={handleClear}></i> : null}
				{children}
			</div>
		</div>;
	} else {
		classList.push("form-control");
		inner = <>
			<input
				name={name}
				type={type}
				value={strValue}
				disabled={isDisabled}
				placeholder={placeholder}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				class={classList.join(" ")}
				style={style}
				maxlength={maxlength}
			/>
			{clearable && strValue && !isDisabled ? <i class="control-clear fa fa-times-circle" onClick={handleClear}></i> : null}
			{children}
		</>;
	}
	return <div class="input-group" style={{ width: width }}>
		{prepend ?
			<div class="input-group-prepend">
				<div class="input-group-text">{prepend}</div>
			</div> :
			null
		}
		{append ?
			<div class="input-group-append">
				<div class="input-group-text">{append}</div>
			</div> :
			null
		}
		<div class="input-group-body">
			{inner}
		</div>
	</div>;
}

/** 文本输入框
 * @remarks
 * 受控单行文本输入，支持前后缀、前置后置内容、字数统计、清空与禁用。
 * @example
 * ```tsx
 * <TextInput value={text} onChange={v => text = v} placeholder="请输入" />
 * ```
 */
export const TextInput = createComponent<TextInputProps, TextInputVM>(TextInputView, TextInputVM);
