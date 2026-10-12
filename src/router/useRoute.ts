import { inject } from "vue";
import type { RouteVM } from "./Route";

/**
 * 在业务组件中获取所属的 Route 上下文。
 * 必须在 `<Route>` 或任意 Router 组件的子树内调用。
 * @returns 最近祖先 Route 的 VM 实例，无祖先时返回 null
 */
export function useRoute(): RouteVM {
	return inject('route');
}
