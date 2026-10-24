import type { Ajax } from "sky-ajax";
import type { CSSProperties } from "vue";
import { createComponent, Inject, Prop, use, useChildren, ViewModel } from "vue-clazz-decorator";
import { JAVASCRIPT_VOID_0 } from "../constant/JAVASCRIPT_VOID_0";
import { Action } from "../hooks/Action";

export interface PlainButtonCallback<T> {
	(args: {
		component: PlainButtonVM,
		event: T,
		ajax: Ajax,
		abortSignal: AbortSignal;
	}): any;
}

/** 空白按钮参数 */
export interface PlainButtonProps {
	/** 是否可用 */
	disabled?: boolean;
	/** 提示信息 */
	title?: string;
	/** 类型别名 */
	class?: string;
	/** 样式 */
	style?: CSSProperties;
	/** 点击事件 */
	onClick?: PlainButtonCallback<MouseEvent>;
	/** 右键跳转地址 */
	href?: string;
}

@ViewModel
export class PlainButtonVM {
	@Prop('class')
	public className: string;
	@Prop
	style?: CSSProperties;
	@Prop
	public disabled?: boolean;
	@Prop
	public title?: string;
	@Inject
	private ajax: Ajax;
	@Inject
	private abortSignal: AbortSignal;

	public action = use(Action);
	@Prop
	public onClick?: PlainButtonCallback<MouseEvent>;
	@Prop
	public href?: string;
	public handleClick(event: MouseEvent) {
		if(!this.onClick) {
			return;
		}
		event.preventDefault();
		if(this.disabled) {
			return;
		}
		this.action.execute(this.onClick, [{
			component: this,
			event,
			ajax: this.ajax,
			abortSignal: this.abortSignal
		}]);
	}
}

export function PlainButtonView(props: PlainButtonVM) {
	var { className, style, title, disabled, action, handleClick, href } = props;
	var children = useChildren();
	var classList = [];
	if(className) classList.push(className);
	if(disabled || action.pending) {
		classList.push('disabled');
	}

	return <a
		href={href || JAVASCRIPT_VOID_0}
		draggable={false}
		class={classList.join(' ')}
		style={style}
		title={title}
		onClick={handleClick}
	>{children}</a>;
}
/** 空白按钮
 * @remarks
 * 空白按钮根据业务需要进行调整，可以放置各种按钮，比如：图片。
 * @example
 * ```tsx
 * <PlainButton class="home-menu-btn" onClick={this.onJdClick}>
 * 		<img src={require("@/assets/images/ddtj.png")} />
 * </PlainButton>
 * ```
 */
export const PlainButton = createComponent<PlainButtonProps, PlainButtonVM>(PlainButtonView, PlainButtonVM);
