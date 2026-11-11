import { Button } from "../button/Button";
import { Link } from "../button/Link";
import { EnvError } from "../error/EnvError";
import { NullError } from "../error/NullError";
import { RequestError } from "../error/RequestError";

import { createComponent, Inject, Prop, useChildren, ViewModel } from "vue-clazz-decorator";
import authError from "../../assets/images/401-error.png";
import notFoundError from "../../assets/images/404-error.png";
import bizError from "../../assets/images/biz-error.png";
import envError from "../../assets/images/env-error.png";
import nullError from "../../assets/images/null-error.png";
import { ServerError } from "../error/ServerError";

export interface ErrorDisplayProps {
	error: Error;
	/** 是否占满高度 */
	fill?: boolean;
	/** 是否行内显示 */
	inline?: boolean;
	/** 刷新代码 */
	onRetry?: () => any;
}

@ViewModel
export class ErrorDisplayVM {
	@Prop
	public error: Error;
	@Prop
	public fill?: boolean;
	@Prop
	public inline?: boolean;
	@Prop
	public onRetry?: () => any;

	@Inject
	public onReLogin: (error: any) => any;

	@Inject
	public retryText = "重试";
	@Inject
	public reloginText = "重新登录";
}

export function ErrorDisplayView(props: ErrorDisplayVM) {
	const { error, fill, inline, onRetry, onReLogin, retryText, reloginText } = props;
	const children = useChildren();
	var message = error.message;
	var btn = null;
	if(inline) {
		if(error instanceof EnvError || error instanceof ServerError) {
			if(onRetry) {
				btn = <Link class="link" onClick={onRetry}>{retryText}</Link>;
			}
		} else if(error instanceof RequestError) {
			if(error.code === 401) {
				if(onReLogin) {
					btn = <Link onClick={this.onReLogin}>{reloginText}</Link>;
				}
			} else if(error.code === 408) {
				if(onRetry) {
					btn = <Link class="link" onClick={onRetry}>{retryText}</Link>;
				}
			}
		}
		if(inline) {
			return <div class="error error-inline">
				{message} {children}<a class="link">{retryText}</a>
			</div>;
		}
	}
	var imgSrc = bizError;
	if(error instanceof EnvError) {
		imgSrc = envError;
		if(onRetry) {
			btn = <Button type="primary" size="sm" onClick={onRetry}>{retryText}</Button>;
		}
	} else if(error instanceof NullError) {
		imgSrc = nullError;
	} else if(error instanceof TypeError) {
		if(error.message.match(/(null|undefined)/)) {
			imgSrc = nullError;
		}
	} else if(error instanceof RequestError) {
		if(error.code === 401) {
			imgSrc = authError;
			if(onReLogin) {
				btn = <Button type="primary" size="sm" onClick={this.onReLogin}>{reloginText}</Button>;
			}
		} else if(error.code === 404) {
			imgSrc = notFoundError;
		} else if(error.code === 408) {
			if(onRetry) {
				btn = <Button type="primary" size="sm" onClick={onRetry}>{retryText}</Button>;
			}
		}
	}
	return <div class={fill ? "error error-fill" : "error error-block"}>
		<div class="error-body">
			<img class="error-image" src={imgSrc} />
			<div class="error-description">{message}</div>
			<div class="error-button-bar">
				{children}
				{btn}
			</div>
		</div>
	</div>;
}

export const ErrorDisplay = createComponent(ErrorDisplayView, ErrorDisplayVM);
