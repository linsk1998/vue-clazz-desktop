/**
 * 请求错误 相当于HTTP 40X错误
 * @remarks
 * 如：未登录、无权限
 * 这种错误全局一般出红色错误提示
 * @example
 * ```ts
 * var error = new RequestError("手机号未填写");
 * error.code = 400;
 * throw error;
 * ```
 * @hideconstructor
 */
export class RequestError extends Error {
	/** 错误码，使用HTTP 40X错误码 */
	public declare code?: number;
	constructor(message: string, options?: Partial<RequestError>) {
		super(message);
		if(options) {
			Object.assign(this, options);
		}
	}
}
