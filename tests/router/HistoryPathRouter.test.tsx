import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick } from "vue";
import { HistoryPathRouter } from "../../src/router/HistoryPathRouter";
import { type RouteRecordRaw } from "../../src/router/Route";

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

function setPath(path: string) {
	history.replaceState(null, '', path);
}

function mountRouter(routes: RouteRecordRaw[]) {
	let vm: any = null;
	const container = document.createElement('div');
	const app = createApp({
		render: () => h(HistoryPathRouter, {
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
	setPath('/');
});

afterEach(() => {
	setPath('/');
});

describe('HistoryPathRouter 初始渲染', () => {
	it('根据 location.pathname 渲染匹配组件', () => {
		setPath('/about');
		const { container } = mountRouter(makeRoutes());
		expect(container.querySelector('.about')).not.toBeNull();
	});

	it('默认路径渲染首页', () => {
		const { container } = mountRouter(makeRoutes());
		expect(container.querySelector('.home')).not.toBeNull();
	});
});

describe('HistoryPathRouter 跳转 API', () => {
	it('push 切换到新路径并渲染', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about');
		await nextTick();
		expect(container.querySelector('.about')).not.toBeNull();
		expect(location.pathname).toBe('/about');
	});

	it('replace 替换路径并渲染', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.replace('/user');
		await nextTick();
		expect(container.querySelector('.user')).not.toBeNull();
		expect(location.pathname).toBe('/user');
	});

	it('push 产生历史记录，back 可回退', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.push('/about');
		vm.push('/user');
		vm.back();
		await flush();
		expect(location.pathname).toBe('/about');
	});
});

describe('HistoryPathRouter popstate', () => {
	it('popstate 事件触发后更新渲染', async () => {
		setPath('/about');
		const { container } = mountRouter(makeRoutes());
		expect(container.querySelector('.about')).not.toBeNull();
		history.back();
		await flush();
		expect(container.querySelector('.home')).not.toBeNull();
	});

	it('go(-1) 后退更新渲染', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about');
		await nextTick();
		vm.go(-1);
		await flush();
		expect(container.querySelector('.home')).not.toBeNull();
	});

	it('forward 前进更新渲染', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about');
		await nextTick();
		vm.back();
		await flush();
		vm.forward();
		await flush();
		expect(container.querySelector('.about')).not.toBeNull();
	});
});

describe('HistoryPathRouter 卸载', () => {
	it('卸载时移除 popstate 监听', () => {
		const spy = vi.spyOn(window, 'removeEventListener');
		const { unmount } = mountRouter(makeRoutes());
		unmount();
		expect(spy).toHaveBeenCalledWith('popstate', expect.any(Function));
		spy.mockRestore();
	});
});
describe('HistoryPathRouter searchParams', () => {
	it('初始从 location.search 解析', () => {
		setPath('/about?foo=bar');
		const { vm } = mountRouter(makeRoutes());
		expect(vm.searchParams.get('foo')).toBe('bar');
	});

	it('初始无 search 时 searchParams 为空', () => {
		setPath('/about');
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
	});

	it('push 不带 query 时清空 searchParams', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.push('/about?a=1');
		await nextTick();
		expect(vm.searchParams.get('a')).toBe('1');
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

	it('popstate 后 searchParams 随 location.search 更新', async () => {
		setPath('/about?a=1');
		const { vm } = mountRouter(makeRoutes());
		vm.push('/user?b=2');
		await nextTick();
		expect(vm.searchParams.get('b')).toBe('2');
		vm.back();
		await flush();
		expect(vm.searchParams.get('a')).toBe('1');
	});

	it('push 带 query 后渲染对应路径组件', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about?a=1');
		await nextTick();
		expect(container.querySelector('.about')).not.toBeNull();
	});

	it('replace 带 query 更新 searchParams 并分离 path', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.replace('/about?a=1&b=2');
		await nextTick();
		expect(vm.searchParams.get('a')).toBe('1');
		expect(vm.searchParams.get('b')).toBe('2');
		expect(vm.path).toBe('/about');
	});

	it('replace 不带 query 时清空 searchParams', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.push('/about?a=1');
		await nextTick();
		vm.replace('/user');
		await nextTick();
		expect(vm.searchParams.size).toBe(0);
		expect(vm.path).toBe('/user');
	});
});
describe('HistoryPathRouter push 跳过当前路径', () => {
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
