import { Ajax, create, RequestInterceptor, ResponseInterceptor, type AjaxContextOptions } from "sky-ajax";
import type { CSSProperties } from "vue";
import { Computed, createComponent, Inject, OnDidCreate, Prop, State, use, useChildren, ViewModel } from "vue-clazz-decorator";
import { Action } from "../hooks/Action";
import type { ContextThemeType } from "../types/ContextThemeType";
import { Icon } from "../views/Icon";

export interface ButtonCallback<T> {
	(args: {
		component: ButtonVM,
		event: T,
		ajax: Ajax,
		abortSignal: AbortSignal;
	}): any;
}

export interface ButtonProps {
	/** 样式类 */
	class?: string;
	/** 样式 */
	style?: CSSProperties;
	/** 按钮图标 */
	icon?: string;
	/** 块级按钮（宽度占满100%） */
	block?: boolean;
	/** 是否处于加载中 */
	loading?: boolean;
	/** 是否置灰 */
	disabled?: boolean;
	/** 是否轮廓按钮 */
	outline?: boolean;
	/** 情景语境 */
	type?: ContextThemeType;
	/** 按钮尺寸 */
	size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
	/** 是否圆角 */
	shape?: 'circle' | 'round';
	/** 原生类型 */
	nativeType?: 'button' | 'submit' | 'reset';
	/** 按钮标记（未读数） */
	badge?: string | number;
	/** 工具提示 */
	title?: string;
	/** 点击事件 */
	onClick?: ButtonCallback<MouseEvent>;
}

@ViewModel
export class ButtonVM {
	@Inject
	private abortSignal: AbortSignal;
	@Inject('ajax')
	private contextAjax: Ajax;
	public ajax: Ajax;
	@State
	public requests: number = 0;

	@OnDidCreate
	protected onDidCreate() {
		const ajaxOptions: AjaxContextOptions = {
			signal: this.abortSignal,
			interceptors: [
				new RequestInterceptor((r) => { this.requests++; return r; }),
				new ResponseInterceptor((r) => { this.requests--; return r; }, (e) => { this.requests--; throw e; })
			]
		};
		this.ajax = this.contextAjax ? this.contextAjax.create(ajaxOptions) : create(ajaxOptions);
	}
	@Inject('disabled')
	private contextDisabled: boolean;
	@Prop('disabled')
	private propDisabled: boolean;
	@Computed
	public get disabled() {
		return this.contextDisabled || this.propDisabled;
	}
	@Prop
	public block: boolean;
	@Prop
	public shape: 'circle' | 'round';
	@Prop
	public type: ContextThemeType;
	@Prop
	public size: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
	@Prop
	public outline: boolean;
	@Prop
	public icon: string;
	@Prop
	public nativeType: 'button' | 'submit' | 'reset' = 'button';
	@Prop
	public badge: string | number;
	@Prop
	public title: string;
	@Prop
	public loading: boolean;

	public action = use(Action);
	@Prop
	public onClick: ButtonCallback<MouseEvent>;
	public async handleClick(e: MouseEvent) {
		if(this.loading || this.disabled) {
			return;
		}
		this.action.execute(this.onClick, [{
			component: this,
			event: e,
			ajax: this.ajax,
			abortSignal: this.abortSignal
		}]);
	}
}

export function ButtonView(props: ButtonVM) {
	const { block, shape, type, size, outline, icon, nativeType, badge, title, disabled, loading } = props;
	const { pending } = props.action;
	const children = useChildren();
	const classList = ['btn'];
	if(block) {
		classList.push('btn-block');
	}
	if(shape) {
		classList.push('btn-round');
		if(shape == "circle") {
			if(size) {
				classList.push('btn-square-' + size);
			} else {
				classList.push('btn-square');
			}
		}
	}
	if(type) {
		if(outline) {
			classList.push('btn-outline-' + type);
		} else {
			classList.push('btn-' + type);
		}
	} else {
		classList.push('btn-default');
	}
	if(size) {
		classList.push('btn-' + size);
	}
	if(loading || pending) {
		classList.push('btn-loading');
	}
	if(disabled) {
		classList.push('btn-disabled');
	}
	let iconClassName: string;
	if(icon) {
		iconClassName = "icon ";
		if(children) {
			iconClassName += "btn-icon-left ";
		}
	}
	return <button
		type={nativeType}
		class={classList.join(' ')}
		title={title}
		onClick={props.handleClick}
		disabled={loading || disabled || pending}
	>
		{icon ?
			props.requests > 0 ?
				<i class={iconClassName + " loading-circular"}></i> :
				<Icon class={iconClassName}>{icon}</Icon> :
			null
		}
		<span class="btn-label">{children}</span>
		{badge ?
			<span class="btn-icon-right badge">{String(badge)}</span> :
			null
		}
	</button>;
}

export const Button = createComponent<ButtonProps, ButtonVM>(ButtonView, ButtonVM);
