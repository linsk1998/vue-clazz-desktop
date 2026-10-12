import * as React from "react";
import { Component } from "react";
import { Button } from "../button/Button";
import { Link } from "../button/Link";
import { EnvError } from "../error/EnvError";
import { NullError } from "../error/NullError";
import { RequestError } from "../error/RequestError";
import { BindEvent } from "../react/BindEvent";
import { trigger } from "../react/trigger";

import { object } from "prop-types";
import authError from "../../assets/ErrorDisplay/images/401-error.png";
import notFoundError from "../../assets/ErrorDisplay/images/404-error.png";
import bizError from "../../assets/ErrorDisplay/images/biz-error.png";
import envError from "../../assets/ErrorDisplay/images/env-error.png";
import nullError from "../../assets/ErrorDisplay/images/null-error.png";
import type { Desktop } from "../desktop/Desktop";
import { ServerError } from "../error/ServerError";

export interface ErrorDisplayProps {
	error: Error;
	/** 是否占满高度 */
	grow?: boolean;
	/** 是否行内显示 */
	inline?: boolean;
	/** 刷新代码 */
	onRetry?: () => any;
}

export class ErrorDisplay extends Component<ErrorDisplayProps> {
	/** @private 给react使用 */
	static contextTypes = {
		root: object
	};
	constructor(props: ErrorDisplayProps) {
		super(props);
		this.onReLogin = this.onReLogin.bind(this);
	}

	@BindEvent()
	private onReLogin() {
		var root: Desktop = this.context.root;
		return trigger(root, 'onReLogin', [root]);
	}

	/** @private 给react使用 */
	render() {
		var { error, inline, grow, children, onRetry } = this.props;
		var message = error.message;
		var onReLogin = this.context.root.props.onReLogin;
		var btn = null;
		if(error instanceof TypeError) {
			if(error.message.match(/(null|undefined)/)) {
				message = "暂无数据";
			}
		}
		if(inline) {
			if(error instanceof EnvError || error instanceof ServerError) {
				if(onRetry) {
					btn = <Link className="text-info ml-1" onClick={onRetry}>重试</Link>;
				}
			} else if(error instanceof RequestError) {
				if(error.code === 401) {
					if(onReLogin) {
						btn = <Link onClick={this.onReLogin}>重新登录</Link>;
					}
				} else if(error.code === 408) {
					if(onRetry) {
						btn = <Link className="text-info ml-1" onClick={onRetry}>重试</Link>;
					}
				}
			}
			return <>
				<span className="zrd-error-inline">{message}</span>
				{children}
				{btn}
			</>;
		}
		if(grow) {
			var imgSrc = bizError;
			if(error instanceof EnvError) {
				imgSrc = envError;
				if(onRetry) {
					btn = <Button type="primary" size="small" onClick={onRetry}>重 试</Button>;
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
						btn = <Button type="primary" size="small" onClick={this.onReLogin}>重新登录</Button>;
					}
				} else if(error.code === 404) {
					imgSrc = notFoundError;
				} else if(error.code === 408) {
					if(onRetry) {
						btn = <Button type="primary" size="small" onClick={onRetry}>重 试</Button>;
					}
				}
			}
			return <div className="zrd-error-grow">
				<div className="zrd-error-grow-inner">
					<img className="zrd-error-grow-image" src={imgSrc} />
					<div className="zrd-error-grow-text">{message}</div>
					{children}
					<div className="zrd-error-grow-button">
						{btn}
					</div>
				</div>
			</div>;
		}
		if(error instanceof EnvError) {
			imgSrc = envError;
			if(onRetry) {
				btn = <Button type="primary" size="mini" onClick={onRetry}>重 试</Button>;
			}
		} else if(error instanceof RequestError) {
			if(error.code === 401) {
				if(onReLogin) {
					btn = <Button type="primary" size="mini" onClick={this.onReLogin}>重新登录</Button>;
				}
			} else if(error.code === 408) {
				if(onRetry) {
					btn = <Button type="primary" size="mini" onClick={onRetry}>重 试</Button>;
				}
			}
		}
		return <div className={error instanceof NullError ? "zrd-error-block-null" : "zrd-error-block"}>
			<p>
				{message}
			</p>
			{children}
			{btn}
		</div>;
	}
}
