import type { CSSProperties } from "vue";
import { createComponent, Prop, State, use, ViewModel } from "vue-clazz-decorator";
import { Action } from "../hooks/Action";

export interface SwitchCallback {
	(component: SwitchVM, value: boolean): Promise<any> | void;
}

/** 开关按钮参数 */
export interface SwitchProps {
	/** 提示信息 */
	title?: string;
	/** 受控值 */
	value?: boolean;
	/** 非受控初始值 */
	defaultValue?: boolean;
	/** 变化回调 */
	onChange?: (value: boolean) => any;
	/** 点击回调，返回 Promise 时进入加载态 */
	onClick?: SwitchCallback;
	/** 是否禁用 */
	disabled?: boolean;
	/** 是否加载中 */
	loading?: boolean;
	/** 样式类 */
	class?: string;
	/** 样式 */
	style?: CSSProperties;
}

@ViewModel
export class SwitchVM {
	@Prop('class')
	public className?: string;
	@Prop
	style?: CSSProperties;
	@Prop
	public title?: string;
	@Prop
	public value?: boolean;
	@Prop
	public defaultValue?: boolean;
	@Prop
	public onChange?: (value: boolean) => any;
	@Prop
	public onClick?: SwitchCallback;
	@Prop
	public disabled?: boolean;
	@Prop
	public loading?: boolean;

	@State
	public innerValue: boolean | undefined = undefined;

	public action = use(Action);

	public get currentValue(): boolean {
		if(this.value !== undefined) {
			return this.value;
		}
		if(this.innerValue !== undefined) {
			return this.innerValue;
		}
		return this.defaultValue ?? false;
	}

	public handleChange(event: Event) {
		var newValue = (event.target as HTMLInputElement).checked;
		this.onChange?.(newValue);
		var onClick = this.onClick;
		if(onClick) {
			var p = this.action.execute(onClick, [this, newValue]);
			if(p && typeof p.then === 'function') {
				p.then(() => {
					if(this.value === undefined) {
						this.innerValue = newValue;
					}
				});
			} else if(this.value === undefined) {
				this.innerValue = newValue;
			}
		} else if(this.value === undefined) {
			this.innerValue = newValue;
		}
	}
}

export function SwitchView(props: SwitchVM) {
	var { className, style, title, disabled, loading, action, currentValue, handleChange } = props;
	var classList = ["switch"];
	if(currentValue) {
		classList.push("switch-checked");
	}
	if(disabled) {
		classList.push("switch-disabled");
	}
	if(loading || action.pending) {
		classList.push("switch-loading");
	}
	return <label class={classList.join(" ")} style={style} title={title}>
		<div class="switch-thumb">
			{(loading || action.pending) ? <div class="loading-spin"></div> : null}
		</div>
		<input type="checkbox" checked={currentValue} disabled={disabled || action.pending} onChange={handleChange} />
	</label>;
}

/** 开关按钮
 * @remarks
 * 用于布尔值切换，支持受控/非受控模式、禁用与加载中状态。
 * @example
 * ```tsx
 * <Switch value={open} onChange={v => open = v} />
 * ```
 */
export const Switch = createComponent<SwitchProps, SwitchVM>(SwitchView, SwitchVM);
