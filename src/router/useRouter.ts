import { inject } from "vue";
import type { Router } from "./Router";

/**
 * 在业务组件中获取所属的 Router 上下文。
 * 必须在 `<MemoryRouter>` / `<HistoryPathRouter>` / `<HistoryHashRouter>` 的子树内调用。
 * @returns 最近祖先 Router 的 VM 实例，可用于 push/replace/go/back/forward 跳转及读取 path、searchParams
 */
export function useRouter(): Router {
	return inject('router');
}
