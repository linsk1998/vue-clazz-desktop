import { describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, ref } from "vue";
import { Route, type RouteRecordRaw } from "../../src/router/Route";

function mountDOM(render: () => any) {
	const container = document.createElement("div");
	createApp({ render }).mount(container);
	return container;
}

async function flush() {
	await nextTick();
	await new Promise(r => setTimeout(r, 0));
	await nextTick();
}

function route(partial: Partial<RouteRecordRaw> & { path: string; }): RouteRecordRaw {
	return { query: {}, meta: {}, exact: false, ...partial };
}

const Home = defineComponent({ render: () => h('div', { class: 'home' }) });
const About = defineComponent({ render: () => h('div', { class: 'about' }) });
const User = defineComponent({ render: () => h('div', { class: 'user' }) });
const NotFound = defineComponent({ render: () => h('div', { class: 'not-found' }) });

describe('Route 匹配', () => {
	it('匹配对应路径渲染对应组件', () => {
		const routes = [
			route({ path: '/', exact: true, component: Home }),
			route({ path: '/about', exact: true, component: About }),
		];
		const container = mountDOM(() => h(Route, { path: '/about', routes }));
		expect(container.querySelector('.about')).not.toBeNull();
		expect(container.querySelector('.home')).toBeNull();
	});

	it('未匹配任何路由时不渲染匹配组件', () => {
		const routes = [route({ path: '/about', exact: true, component: About })];
		const container = mountDOM(() => h(Route, { path: '/xxx', routes }));
		expect(container.querySelector('.about')).toBeNull();
	});

	it('exact=true 只精确匹配', () => {
		const routes = [route({ path: '/about', exact: true, component: About })];
		const exact = mountDOM(() => h(Route, { path: '/about', routes }));
		expect(exact.querySelector('.about')).not.toBeNull();
		const sub = mountDOM(() => h(Route, { path: '/about/detail', routes }));
		expect(sub.querySelector('.about')).toBeNull();
	});

	it('exact=false 前缀匹配子路径', () => {
		const routes = [route({ path: '/about', exact: false, component: About })];
		const container = mountDOM(() => h(Route, { path: '/about/detail', routes }));
		expect(container.querySelector('.about')).not.toBeNull();
	});

	it('提取路径参数 params', () => {
		const routes = [route({ path: '/user/:id', exact: true, component: User })];
		const container = mountDOM(() => h(Route, { path: '/user/123', routes }));
		expect(container.querySelector('.user')).not.toBeNull();
	});

	it('按声明顺序优先匹配前者', () => {
		const routes = [
			route({ path: '/about', exact: false, component: About }),
			route({ path: '/about', exact: true, component: Home }),
		];
		const container = mountDOM(() => h(Route, { path: '/about', routes }));
		expect(container.querySelector('.about')).not.toBeNull();
		expect(container.querySelector('.home')).toBeNull();
	});
});

describe('Route 异步组件', () => {
	it('加载异步组件成功后渲染', async () => {
		const AsyncComp = defineComponent({ render: () => h('div', { class: 'async' }) });
		const loader = () => Promise.resolve(AsyncComp);
		const routes = [route({ path: '/about', exact: true, component: loader as any })];
		const container = mountDOM(() => h(Route, { path: '/about', routes }));
		await flush();
		expect(container.querySelector('.async')).not.toBeNull();
	});

	it('加载期间展示 loadingComponent', async () => {
		vi.useFakeTimers();
		const Loading = defineComponent({ render: () => h('div', { class: 'loading' }) });
		const AsyncComp = defineComponent({ render: () => h('div', { class: 'async' }) });
		let resolveFn: (v: any) => void;
		const loader = () => new Promise(r => { resolveFn = r; });
		const routes = [route({ path: '/about', exact: true, component: loader as any })];
		const container = mountDOM(() => h(Route, { path: '/about', routes, loadingComponent: Loading }));
		await vi.advanceTimersByTimeAsync(200);
		await nextTick();
		expect(container.querySelector('.loading')).not.toBeNull();
		resolveFn!(AsyncComp);
		await vi.advanceTimersByTimeAsync(0);
		await nextTick();
		expect(container.querySelector('.async')).not.toBeNull();
		vi.useRealTimers();
	});

	it('加载失败展示 errorComponent', async () => {
		vi.useFakeTimers();
		const ErrorComp = defineComponent({ render: () => h('div', { class: 'error' }) });
		const loader = () => Promise.reject(new Error('load fail'));
		const routes = [route({ path: '/about', exact: true, component: loader as any })];
		const container = mountDOM(() => h(Route, { path: '/about', routes, errorComponent: ErrorComp }));
		await vi.advanceTimersByTimeAsync(200);
		await nextTick();
		expect(container.querySelector('.error')).not.toBeNull();
		vi.useRealTimers();
	});

	it('异步组件函数可重复运行', async () => {
		let loadCount = 0;
		const AsyncComp = defineComponent({ render: () => h('div', { class: 'async' }) });
		const loader = ({ abortSignal }: { abortSignal: AbortSignal; }) => {
			loadCount++;
			return Promise.resolve(AsyncComp);
		};
		const routes = [
			route({ path: '/about', exact: true, component: loader as any }),
			route({ path: '/other', exact: true, component: NotFound }),
		];
		const path = ref('/about');
		const container = mountDOM(() => h(Route, { path: path.value, routes }));
		await flush();
		expect(container.querySelector('.async')).not.toBeNull();
		expect(loadCount).toBe(1);
		path.value = '/other';
		await flush();
		expect(container.querySelector('.not-found')).not.toBeNull();
		path.value = '/about';
		await flush();
		expect(container.querySelector('.async')).not.toBeNull();
		expect(loadCount).toBe(2);
	});

	it('路由切换时取消旧的异步加载（竞态）', async () => {
		function sleep(ms: number, signal?: AbortSignal) {
			return new Promise<void>((resolve, reject) => {
				const timer = setTimeout(resolve, ms);
				signal?.addEventListener('abort', () => {
					clearTimeout(timer);
					reject(new Error('aborted'));
				});
			});
		}
		const Slow = defineComponent({ render: () => h('div', { class: 'slow' }) });
		const Fast = defineComponent({ render: () => h('div', { class: 'fast' }) });
		let slowAborted = false;
		const slowLoader = ({ abortSignal }: { abortSignal: AbortSignal; }) => {
			return sleep(100, abortSignal).then(() => Slow).catch(() => {
				slowAborted = true;
				throw new Error('aborted');
			});
		};
		const fastLoader = () => Promise.resolve(Fast);
		const routes = [
			route({ path: '/slow', exact: true, component: slowLoader as any }),
			route({ path: '/fast', exact: true, component: fastLoader as any }),
		];
		const path = ref('/slow');
		const container = mountDOM(() => h(Route, { path: path.value, routes }));
		await nextTick();
		path.value = '/fast';
		await flush();
		await new Promise(r => setTimeout(r, 120));
		await nextTick();
		expect(container.querySelector('.fast')).not.toBeNull();
		expect(container.querySelector('.slow')).toBeNull();
		expect(slowAborted).toBe(true);
	});
});

describe('Route 嵌套', () => {
	it('子 Route 从父 Route 截取路径匹配', () => {
		const Detail = defineComponent({ render: () => h('div', { class: 'detail' }) });
		const AboutWithChild = defineComponent({
			render: () => h(Route, { routes: [route({ path: '/detail', exact: true, component: Detail })] }),
		});
		const routes = [route({ path: '/about', exact: false, component: AboutWithChild })];
		const container = mountDOM(() => h(Route, { path: '/about/detail', routes }));
		expect(container.querySelector('.detail')).not.toBeNull();
	});

	it('子 Route 未匹配子路径时渲染空', () => {
		const AboutWithChild = defineComponent({
			render: () => h(Route, { routes: [route({ path: '/detail', exact: true, component: NotFound })] }),
		});
		const routes = [route({ path: '/about', exact: false, component: AboutWithChild })];
		const container = mountDOM(() => h(Route, { path: '/about/other', routes }));
		expect(container.querySelector('.not-found')).toBeNull();
	});

	it('子 Route 未传 routes 时从父匹配项的 children 匹配', () => {
		const Detail = defineComponent({ render: () => h('div', { class: 'detail' }) });
		const AboutWithChild = defineComponent({
			render: () => h(Route),
		});
		const routes = [route({
			path: '/about', exact: false, component: AboutWithChild, children: [
				route({ path: '/detail', exact: true, component: Detail }),
			]
		})];
		const container = mountDOM(() => h(Route, { path: '/about/detail', routes }));
		expect(container.querySelector('.detail')).not.toBeNull();
	});

	it('子 Route 未传 routes 且父匹配项无 children 时渲染空', () => {
		const AboutWithChild = defineComponent({
			render: () => h(Route),
		});
		const routes = [route({ path: '/about', exact: false, component: AboutWithChild })];
		const container = mountDOM(() => h(Route, { path: '/about/detail', routes }));
		expect(container.textContent).toBe('');
	});
});
