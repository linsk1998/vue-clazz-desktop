/** 所有 Router 组件 ViewModel 的公共 API 契约。 */
export interface Router {
	/** 当前路径，以 "/" 开头。 */
	readonly path: string;
	/** 当前查询参数。 */
	readonly searchParams: URLSearchParams;
	/** 压入新路径，产生可回退的历史项。 */
	push(path: string): void;
	/** 替换当前路径，不保留回退入口。 */
	replace(path: string): void;
	/** 在历史栈中跨步移动。 */
	go(n: number): void;
	/** 后退一步。 */
	back(): void;
	/** 前进一步。 */
	forward(): void;
}
/** 拼接路径与查询参数为完整路径字符串。 */
export function fullPath(path: string, searchParams: URLSearchParams): string {
	const q = searchParams.toString();
	return q ? `${path}?${q}` : path;
}
