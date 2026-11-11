export interface CheckboxProps {
	class?: string;
	name?: string;
	value?: string | number;
	checked?: boolean;
	disabled?: boolean;
	invalid?: boolean;
	indeterminate?: boolean;
	onChange?: (checked: boolean, value: string | number) => any;
	onFocus?: () => any;
	onBlur?: () => any;
}

/** 复选框
 * @remarks
 * 基于 `.checkbox` 样式的复选框，支持受控选中、半选、禁用与校验失败态。
 * @example
 * ```tsx
 * <Checkbox value={1} checked={has} onChange={(c, val) => has = c} />
 * ```
 */
export function Checkbox(props: CheckboxProps) {
	var { class: className, name, value, checked, disabled, invalid, indeterminate, onChange, onFocus, onBlur } = props;
	function handleChange(e: Event) {
		if(onChange) {
			onChange((e.target as HTMLInputElement).checked, value);
		}
	}
	var classList = ["checkbox"];
	if(className) {
		classList.push(className);
	}
	if(indeterminate) {
		classList.push("checkbox-indeterminate");
	} else if(checked) {
		classList.push("checkbox-checked");
	}
	if(disabled) {
		classList.push("checkbox-disabled");
	}
	if(invalid) {
		classList.push("is-invalid");
	}
	return <div class={classList.join(" ")}>
		<input
			type="checkbox"
			name={name}
			value={value}
			checked={!!checked}
			onChange={handleChange}
			onFocus={onFocus}
			onBlur={onBlur}
			disabled={disabled}
		/>
	</div>;
}
