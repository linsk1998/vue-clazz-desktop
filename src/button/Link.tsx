import type { Ajax } from "sky-ajax";
import type { CSSProperties } from "vue";
import { createComponent, Inject, Prop, use, useChildren, ViewModel } from "vue-clazz-decorator";
import { Action } from "../hooks/Action";
import type { ContextThemeType } from "../types/ContextThemeType";
import { Icon } from "../views/Icon";

export interface LinkCallback<T> {
	(args: {
		component: LinkVM,
		event: T,
		ajax: Ajax,
		abortSignal: AbortSignal;
	}): any;
}

/** 标签按钮参数 */
export interface LinkProps {
	/** 原生 href 属性 */
	href?: string;
	/** 情景类型 */
	type?: ContextThemeType;
	/** 是否禁用状态 */
	disabled?: boolean;
	/** 图标 */
	icon?: string;
	/** 无下划线 */
	noUnderline?: boolean;
	/** 样式类 */
	class?: string;
	/** 样式 */
	style?: CSSProperties;
	/** 点击事件 */
	onClick?: LinkCallback<MouseEvent>;
}

@ViewModel
export class LinkVM {
	@Prop
	public href?: string;
	@Prop
	public type?: ContextThemeType;
	@Prop
	public disabled?: boolean;
	@Prop
	public icon?: string;
	@Prop
	public noUnderline?: boolean;
	@Prop
	public onClick?: LinkCallback<MouseEvent>;

	@Inject
	private ajax: Ajax;
	@Inject
	private abortSignal: AbortSignal;

	public action = use(Action);

	public handleOnClick(event: MouseEvent) {
		if(this.disabled || !this.onClick) {
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

export function LinkView(props: LinkVM) {
	var { href, type, disabled, icon, noUnderline, action } = props;
	var children = useChildren();
	var classList = ["link"];
	if(type) {
		classList.push("link-" + type);
	} else {
		classList.push("link-secondary");
	}
	if(disabled || action.pending) {
		classList.push("link-disabled");
	}
	if(noUnderline) {
		classList.push("text-decoration-none");
	}
	return <a
		href={href || "javascript:void 0"}
		draggable={false}
		class={classList.join(' ')}
		onClick={props.handleOnClick}
	>
		{icon ?
			<Icon>{icon}</Icon> :
			null
		}
		{children}
	</a>;
}

/** 标签按钮
 * @remarks
 * 基于 `.link` 样式的超链接按钮，支持语义色、禁用、图标和无下划线。
 * @example
 * ```tsx
 * <Link type="primary">主要链接</Link>
 * <Link type="danger" icon="trash">删除</Link>
 * <Link disabled>禁用链接</Link>
 * ```
 */
export const Link = createComponent<LinkProps, LinkVM>(LinkView, LinkVM);
