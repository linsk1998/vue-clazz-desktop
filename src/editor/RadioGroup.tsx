import { Loading } from "../busy/Loading";
import type { OptionSelect } from "../types/OptionSelect";
import { Radio } from "./Radio";

export interface RadioGroupProps {
	name?: string;
	value?: string | number;
	disabled?: boolean;
	invalid?: boolean;
	options: OptionSelect[];
	loading?: boolean;
	error?: Error;
	onChange?: (value: any, item: any) => any;
	onBlur?: () => any;
	onFocus?: () => any;
	/** 选择点击事件 */
	onReload?: () => any;
}

/** 单选框组
 * @remarks
 * 根据 options 渲染一组单选框，支持加载中、错误重试与禁用。
 * @example
 * ```tsx
 * <RadioGroup options={opts} value={v} onChange={val => v = val} />
 * ```
 */
export function RadioGroup(props: RadioGroupProps) {
	var { name, value, disabled, invalid, options, loading, error, onChange, onReload } = props;
	function handleItemChange(checked: boolean, itemValue: string | number) {
		if(checked && options && onChange) {
			for(var i = 0; i < options.length; i++) {
				var option = options[i];
				if(option.value == itemValue) {
					onChange(option.value, option.origin);
					break;
				}
			}
		}
	}
	return <div class="radio-group">
		{options && !loading && !error ?
			options.map(option => option.hidden ? null :
				<label class="radio-inline" key={option.value}>
					<Radio
						name={name}
						value={option.value}
						checked={option.value == value}
						onChange={handleItemChange}
						disabled={disabled || option.disabled}
						invalid={invalid}
					/>
					<span class={"vertical-align-middle" + ((disabled || option.disabled) ? " disabled" : "")}>{option.label}</span>
				</label>
			) :
			null
		}
		{error && !loading ?
			<>
				<span class="text-danger">{error.message}</span>
				{onReload ? <a href="javascript:void 0" class="link link-info ml-1" onClick={onReload}>重试</a> : null}
			</> :
			null
		}
		{loading ?
			<Loading inline /> :
			null
		}
	</div>;
}
