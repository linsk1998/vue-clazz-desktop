export interface RadioProps {
	name?: string;
	value?: string | number;
	checked?: boolean;
	disabled?: boolean;
	invalid?: boolean;
	onChange?: (checked: boolean, value: string | number) => any;
	onFocus?: () => any;
	onBlur?: () => any;
}

/** 单选框
 * @remarks
 * 基于 `.radio` 样式的单选框，支持受控选中、禁用与校验失败态。
 * @example
 * ```tsx
 * <Radio value={1} checked={v === 1} onChange={(c, val) => v = val} />
 * ```
 */
export function Radio(props: RadioProps) {
	var { name, value, checked, disabled, invalid, onChange, onFocus, onBlur } = props;
	function handleChange(e: Event) {
		if(onChange) {
			onChange((e.target as HTMLInputElement).checked, value);
		}
	}
	var classList = ["radio"];
	if(checked) {
		classList.push("radio-checked");
	}
	if(disabled) {
		classList.push("radio-disabled");
	}
	if(invalid) {
		classList.push("is-invalid");
	}
	return <div class={classList.join(" ")}>
		<input
			type="radio"
			name={name}
			value={value}
			checked={checked}
			onChange={handleChange}
			onFocus={onFocus}
			onBlur={onBlur}
			disabled={disabled}
		/>
	</div>;
}
