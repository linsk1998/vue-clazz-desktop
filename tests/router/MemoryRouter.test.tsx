import { describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick } from "vue";
import { MemoryRouter } from "../../src/router/MemoryRouter";
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

function mountRouter(routes: RouteRecordRaw[], path?: string) {
	let vm: any = null;
	const container = document.createElement('div');
	const app = createApp({
		render: () => h(MemoryRouter, {
			ref: (el: any) => { vm = el; },
			routes,
			path,
		} as any),
	});
	app.mount(container);
	return {
		container,
		get vm() { return vm; },
		unmount() { app.unmount(); },
	};
}

describe('MemoryRouter 初始渲染', () => {
	it('默认初始路径为 "/" 渲染首页', () => {
		const { container } = mountRouter(makeRoutes());
		expect(container.querySelector('.home')).not.toBeNull();
	});

	it('根据 path 渲染匹配组件', () => {
		const { container } = mountRouter(makeRoutes(), '/about');
		expect(container.querySelector('.about')).not.toBeNull();
	});

	it('path 不影响浏览器 URL', () => {
		const spy = vi.spyOn(history, 'pushState');
		const spy2 = vi.spyOn(history, 'replaceState');
		mountRouter(makeRoutes(), '/about');
		expect(spy).not.toHaveBeenCalled();
		expect(spy2).not.toHaveBeenCalled();
		spy.mockRestore();
		spy2.mockRestore();
	});
});

describe('MemoryRouter 跳转 API', () => {
	it('push 切换到新路径并渲染', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about');
		await nextTick();
		expect(container.querySelector('.about')).not.toBeNull();
		expect(vm.path).toBe('/about');
	});

	it('replace 替换当前路径并渲染', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.replace('/user');
		await nextTick();
		expect(container.querySelector('.user')).not.toBeNull();
		expect(vm.path).toBe('/user');
	});

	it('push 不调用 history API', () => {
		const { vm } = mountRouter(makeRoutes());
		const spy = vi.spyOn(history, 'pushState');
		vm.push('/about');
		expect(spy).not.toHaveBeenCalled();
		spy.mockRestore();
	});

	it('replace 不调用 history API', () => {
		const { vm } = mountRouter(makeRoutes());
		const spy = vi.spyOn(history, 'replaceState');
		vm.replace('/about');
		expect(spy).not.toHaveBeenCalled();
		spy.mockRestore();
	});
});

describe('MemoryRouter 内存历史栈', () => {
	it('push 产生内存历史，back 可回退', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about');
		vm.push('/user');
		await nextTick();
		expect(container.querySelector('.user')).not.toBeNull();
		vm.back();
		await nextTick();
		expect(vm.path).toBe('/about');
		expect(container.querySelector('.about')).not.toBeNull();
	});

	it('back 到初始路径', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about');
		await nextTick();
		vm.back();
		await nextTick();
		expect(vm.path).toBe('/');
		expect(container.querySelector('.home')).not.toBeNull();
	});

	it('forward 前进恢复路径', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about');
		await nextTick();
		vm.back();
		await nextTick();
		expect(vm.path).toBe('/');
		vm.forward();
		await nextTick();
		expect(vm.path).toBe('/about');
		expect(container.querySelector('.about')).not.toBeNull();
	});

	it('go(n) 跨步移动', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.push('/about');
		vm.push('/user');
		await nextTick();
		vm.go(-2);
		await nextTick();
		expect(vm.path).toBe('/');
	});

	it('go 越界时保持当前路径', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.go(-1);
		expect(vm.path).toBe('/');
		vm.go(10);
		expect(vm.path).toBe('/');
	});

	it('push 后再 push 会截断 forward 历史', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.push('/about');
		vm.push('/user');
		vm.back();
		await nextTick();
		expect(vm.path).toBe('/about');
		vm.push('/user');
		await nextTick();
		vm.forward();
		await nextTick();
		expect(vm.path).toBe('/user');
	});

	it('replace 不增加历史长度', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.push('/about');
		vm.replace('/user');
		await nextTick();
		vm.back();
		await nextTick();
		expect(vm.path).toBe('/');
	});
});

describe('MemoryRouter searchParams', () => {
	it('path 带 query 解析 searchParams', () => {
		const { vm } = mountRouter(makeRoutes(), '/about?foo=bar');
		expect(vm.searchParams.get('foo')).toBe('bar');
		expect(vm.path).toBe('/about');
	});

	it('path 无 query 时 searchParams 为空', () => {
		const { vm } = mountRouter(makeRoutes(), '/about');
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

	it('back 后 searchParams 随历史恢复', async () => {
		const { vm } = mountRouter(makeRoutes(), '/about?a=1');
		vm.push('/user?b=2');
		await nextTick();
		expect(vm.searchParams.get('b')).toBe('2');
		vm.back();
		await nextTick();
		expect(vm.searchParams.get('a')).toBe('1');
	});

	it('push 带 query 渲染对应路径组件', async () => {
		const { container, vm } = mountRouter(makeRoutes());
		vm.push('/about?a=1');
		await nextTick();
		expect(container.querySelector('.about')).not.toBeNull();
	});
});
describe('MemoryRouter push 跳过当前路径', () => {
	it('push 当前路径时不产生重复历史', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.push('/about');
		await nextTick();
		vm.push('/about');
		await nextTick();
		vm.back();
		await nextTick();
		expect(vm.path).toBe('/');
	});

	it('push 当前含 query 路径时跳过', async () => {
		const { vm } = mountRouter(makeRoutes());
		vm.push('/about?a=1');
		await nextTick();
		vm.push('/about?a=1');
		await nextTick();
		vm.back();
		await nextTick();
		expect(vm.path).toBe('/');
	});
});
