import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick } from "vue";
import { HistoryHashRouter } from "../../src/router/HistoryHashRouter";
import { type RouteRecordRaw } from "../../src/router/Route";

function isHistoryAPISupported(): boolean {
	return typeof history !== 'undefined' && typeof (history as any).pushState === 'function';
}

function route(partial: Partial<RouteRecordRaw> & { path: string; }): RouteRecordRaw {
	return { query: {}, meta: {}, exact: false, ...partial };
}

const Home = defineComponent({ render: () => h('div', { class: 'home' }) });
const About = defineComponent({ render: () => h('div', { class: 'about' }) });
const User = defineComponent({ render: () => h('div', { class: 'user' }) });

function makeRoutes() {
	return [
		route({ path: '/', exact: true, component: Home }),
		route({ path: '/about', exact: true, component: About }),
		route({ path: '/user', exact: true, component: User }),
	];
}

function setHash(hash: string) {
	history.replaceState(null, '', hash);
}

function mountRouter(routes: RouteRecordRaw[]) {
	let vm: any = null;
	const container = document.createElement('div');
	const app = createApp({
		render: () => h(HistoryHashRouter, {
			ref: (el: any) => { vm = el; },
			routes,
		} as any),
	});
	app.mount(container);
	return {
		container,
		get vm() { return vm; },
		unmount() { app.unmount(); },
	};
}

async function flush() {
	await nextTick();
	await new Promise(r => setTimeout(r, 50));
	await nextTick();
}

beforeEach(() => {
	setHash('#/');
});

afterEach(() => {
	setHash('#/');
});

describe('HistoryHashRouter 初始渲染', () => {
	it('默认 hash 为空时渲染首页', () => {
		setHash('#');
		const { container } = mountRouter(makeRoutes());
		expect(container.querySelector('.home')).not.toBeNull();
	});

	it('根据 location.hash 渲染匹配组件', () => {
		setHash('#/about');
		const { container } = mountRouter(makeRoutes());
		expect(container.querySelector('.about')).not.toBeNull();
	});
});

describe('HistoryHashRouter 跳转 API', () => {
	it('push 切换 hash 并渲染', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about');
		await nextTick();
		expect(container.querySelector('.about')).not.toBeNull();
		expect(vm.path).toBe('/about');
		expect(location.hash).toBe('#/about');
	});

	it('replace 替换 hash 并渲染', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.replace('/user');
		await nextTick();
		expect(container.querySelector('.user')).not.toBeNull();
		expect(location.hash).toBe('#/user');
	});

	it('push 产生历史记录，back 可回退', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about');
		vm.push('/user');
		await nextTick();
		expect(container.querySelector('.user')).not.toBeNull();
		vm.back();
		await flush();
		expect(vm.path).toBe('/about');
		expect(container.querySelector('.about')).not.toBeNull();
	});

	it('forward 前进恢复', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about');
		await nextTick();
		vm.back();
		await flush();
		expect(vm.path).toBe('/');
		vm.forward();
		await flush();
		expect(vm.path).toBe('/about');
		expect(container.querySelector('.about')).not.toBeNull();
	});

	it('go(-1) 后退更新渲染', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about');
		await nextTick();
		vm.go(-1);
		await flush();
		expect(container.querySelector('.home')).not.toBeNull();
	});
});

describe('HistoryHashRouter popstate', () => {
	it('popstate 事件触发后更新渲染', async () => {
		setHash('#/about');
		const { container } = mountRouter(makeRoutes());
		expect(container.querySelector('.about')).not.toBeNull();
		history.back();
		await flush();
		expect(container.querySelector('.home')).not.toBeNull();
	});
});

describe('HistoryHashRouter 卸载', () => {
	it('卸载时移除 popstate 监听', () => {
		const spy = vi.spyOn(window, 'removeEventListener');
		const { unmount } = mountRouter(makeRoutes());
		unmount();
		expect(spy).toHaveBeenCalledWith('popstate', expect.any(Function));
		spy.mockRestore();
	});
});

describe('HistoryHashRouter searchParams', () => {
	it('初始从 hash 解析 query', () => {
		setHash('#/about?foo=bar');
		const { vm } = mountRouter(makeRoutes());
		expect(vm.searchParams.get('foo')).toBe('bar');
		expect(vm.path).toBe('/about');
	});

	it('初始无 query 时 searchParams 为空', () => {
		setHash('#/about');
		const { vm } = mountRouter(makeRoutes());
		expect(vm.searchParams.size).toBe(0);
	});

	it('push 带 query 更新 searchParams 并分离 path', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.push('/about?a=1&b=2');
		await nextTick();
		expect(vm.searchParams.get('a')).toBe('1');
		expect(vm.searchParams.get('b')).toBe('2');
		expect(vm.path).toBe('/about');
		expect(location.hash).toBe('#/about?a=1&b=2');
	});

	it('push 不带 query 清空 searchParams', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.push('/about?a=1');
		await nextTick();
		vm.push('/user');
		await nextTick();
		expect(vm.searchParams.size).toBe(0);
		expect(vm.path).toBe('/user');
	});

	it('push 同名 query 保留全部值', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.push('/about?a=1&a=2');
		await nextTick();
		expect(vm.searchParams.getAll('a')).toEqual(['1', '2']);
	});

	it('replace 带 query 更新 searchParams', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.replace('/about?a=1&b=2');
		await nextTick();
		expect(vm.searchParams.get('a')).toBe('1');
		expect(vm.searchParams.get('b')).toBe('2');
		expect(vm.path).toBe('/about');
	});

	it('back 后 searchParams 随 hash 恢复', async () => {
		setHash('#/about?a=1');
		const { vm } = mountRouter(makeRoutes());
		vm.push('/user?b=2');
		await nextTick();
		expect(vm.searchParams.get('b')).toBe('2');
		vm.back();
		await flush();
		expect(vm.searchParams.get('a')).toBe('1');
	});

	it('push 带 query 渲染对应路径组件', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about?a=1');
		await nextTick();
		expect(container.querySelector('.about')).not.toBeNull();
	});
});

describe('HistoryHashRouter 降级检测', () => {
	it('isHistoryAPISupported 在标准环境返回 true', () => {
		expect(isHistoryAPISupported()).toBe(true);
	});

	it('isHistoryAPISupported 无 pushState 时返回 false', () => {
		const original = history.pushState;
		Object.defineProperty(history, 'pushState', { value: undefined, configurable: true, writable: true });
		expect(isHistoryAPISupported()).toBe(false);
		Object.defineProperty(history, 'pushState', { value: original, configurable: true, writable: true });
	});

	it('isHistoryAPISupported 无 history 时返回 false', () => {
		const original = (window as any).history;
		Object.defineProperty(window, 'history', { value: undefined, configurable: true, writable: true });
		expect(isHistoryAPISupported()).toBe(false);
		Object.defineProperty(window, 'history', { value: original, configurable: true, writable: true });
	});
});
describe('HistoryHashRouter push 跳过当前路径', () => {
	it('push 当前路径时不产生重复历史', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.push('/about');
		await nextTick();
		vm.push('/about');
		await nextTick();
		vm.back();
		await flush();
		expect(vm.path).toBe('/');
	});
});
