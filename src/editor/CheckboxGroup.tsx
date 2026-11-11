import { Loading } from "../busy/Loading";
import type { OptionSelect } from "../types/OptionSelect";
import { Checkbox } from "./Checkbox";

function arrayIncludeLoose(array: any[], item: any) {
	if(array) {
		for(var i = 0; i < array.length; i++) {
			if(item == array[i]) {
				return true;
			}
		}
	}
	return false;
}

export interface CheckboxGroupProps {
	name?: string;
	value?: Array<string | number>;
	disabled?: boolean;
	invalid?: boolean;
	options: OptionSelect[];
	loading?: boolean;
	error?: Error;
	onChange?: (value: Array<any>, item?: any) => any;
	onBlur?: () => any;
	onFocus?: () => any;
	/** 选择点击事件 */
	onReload?: () => any;
}

/** 复选框组
 * @remarks
 * 根据 options 渲染一组复选框，支持多选数组值、加载中、错误重试与禁用。
 * @example
 * ```tsx
 * <CheckboxGroup options={opts} value={arr} onChange={val => arr = val} />
 * ```
 */
export function CheckboxGroup(props: CheckboxGroupProps) {
	var { name, value, disabled, invalid, options, loading, error, onChange, onReload } = props;
	function handleItemChange(checked: boolean, itemValue: string | number) {
		var array = value;
		if(checked) {
			array = array ? Array.prototype.slice.call(array) : [];
			if(options && onChange) {
				for(var i = 0; i < options.length; i++) {
					var option = options[i];
					if(option.value == itemValue) {
						array.push(option.value);
						onChange(array, option.origin);
						break;
					}
				}
			}
		} else if(onChange) {
			array = (array || []).filter(item => item != itemValue);
			onChange(array);
		}
	}
	return <div class="checkbox-group">
		{options && !loading && !error ?
			options.map(option => option.hidden ? null :
				<label class="checkbox-inline" key={option.value}>
					<Checkbox
						name={name}
						value={option.value}
						checked={arrayIncludeLoose(value, option.value)}
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
