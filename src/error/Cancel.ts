/**
 * 正常取消
 * @remarks
 * 不需要提示
 * @example
 * ```ts
 * throw new Cancel();
 * ```
 * @hideconstructor
 */
export class Cancel extends DOMException {
	constructor(message?: string) {
		super(message, 'AbortError');
	}
}
