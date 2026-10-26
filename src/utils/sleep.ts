/** 延迟运行异步函数
 * @param ms - 毫秒
 * @example
 * ```ts
 * // 延迟2秒
 * await sleep(2000);
 * ```
 */
export function sleep(ms: number): Promise<void> {
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve();
		}, ms);
	});
}
