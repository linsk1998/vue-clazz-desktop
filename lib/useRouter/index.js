import { inject } from 'vue';

/**
 * 在业务组件中获取所属的 Router 上下文。
 * 必须在 `<MemoryRouter>` / `<HistoryPathRouter>` / `<HistoryHashRouter>` 的子树内调用。
 * @returns 最近祖先 Router 的 VM 实例，可用于 push/replace/go/back/forward 跳转及读取 path、searchParams
 */
function useRouter() {
  return inject('router');
}

export { useRouter as default, useRouter };
