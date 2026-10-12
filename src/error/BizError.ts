/** 业务错误
 * @remarks
 * 这种错误全局一般出红色错误提示
 * @example
 * ```ts
 * throw new BizError("您的状态为未婚，不能办理该业务");
 * ```
 * @hideconstructor
 */
export class BizError extends Error {
	/** 错误码，由后端定义 */
	public declare code?: number;
	/** 结果数据，由后端定义 */
	public declare data?: any;

	constructor(message: string, options?: Partial<BizError>) {
		super(message);
		if(options) {
			Object.assign(this, options);
		}
	}
}
