/**
 * 服务端错误
 * @remarks
 * 一般不处理或者给出笼统的提示，提示语往往是安慰用户的，不是真正的问题。
 * 全局一般出红色错误提示。
 * 排查方向为nginx到应用服务器的问题。
 * @example
 * ```ts
 * throw new ServerError("系统正在传递福利，请稍后再试。");
 * ```
 * @hideconstructor
 */
export class ServerError extends Error {
	/** 错误码，使用HTTP 50X错误码 */
	public declare code?: number;
	constructor(message: string, options?: Partial<ServerError>) {
		super(message);
		if(options) {
			Object.assign(this, options);
		}
	}
}
