import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp, defineComponent, h, nextTick } from "vue";
import { HistoryHashRouter } from "../../src/router/HistoryHashRouter";
import { HistoryPathRouter } from "../../src/router/HistoryPathRouter";
import { MemoryRouter } from "../../src/router/MemoryRouter";
import { type RouteRecordRaw } from "../../src/router/Route";

function route(partial: Partial<RouteRecordRaw> & { path: string; }): RouteRecordRaw {
	return { query: {}, meta: {}, exact: false, ...partial };
}

const TabA = defineComponent({ render: () => h('div', { class: 'tab-a' }) });
const TabB = defineComponent({ render: () => h('div', { class: 'tab-b' }) });
const PageOther = defineComponent({ render: () => h('div', { class: 'page-other' }) });

function makeTabRoutes() {
	return [
		route({ path: '/', exact: true, component: TabA }),
		route({ path: '/b', exact: true, component: TabB }),
	];
}

function setUrl(path: string) {
	history.replaceState(null, '', path);
}

async function flush() {
	await nextTick();
	await new Promise(r => setTimeout(r, 50));
	await nextTick();
}

function mountOuter(Outer: any, routes: RouteRecordRaw[]) {
	let vm: any = null;
	const container = document.createElement('div');
	const app = createApp({
		render: () => h(Outer, {
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

beforeEach(() => {
	setUrl('/');
});

afterEach(() => {
	setUrl('/');
});

describe('HistoryPathRouter > MemoryRouter', () => {
	it('外层匹配页面，内层 MemoryRouter 渲染初始 tab', () => {
		let innerVm: any = null;
		const PageWithMemory = defineComponent({
			render: () => h(MemoryRouter, {
				ref: (el: any) => { innerVm = el; },
				routes: makeTabRoutes(),
			} as any),
		});
		const routes = [
			route({ path: '/', exact: false, component: PageWithMemory }),
			route({ path: '/other', exact: true, component: PageOther }),
		];
		const { container } = mountOuter(HistoryPathRouter, routes);
		expect(container.querySelector('.tab-a')).not.toBeNull();
		expect(innerVm).not.toBeNull();
	});

	it('内层 push 切换 tab 不影响浏览器 pathname', async () => {
		let innerVm: any = null;
		const PageWithMemory = defineComponent({
			render: () => h(MemoryRouter, {
				ref: (el: any) => { innerVm = el; },
				routes: makeTabRoutes(),
			} as any),
		});
		const routes = [
			route({ path: '/', exact: false, component: PageWithMemory }),
			route({ path: '/other', exact: true, component: PageOther }),
		];
		const { container } = mountOuter(HistoryPathRouter, routes);
		innerVm.push('/b');
		await nextTick();
		expect(container.querySelector('.tab-b')).not.toBeNull();
		expect(location.pathname).toBe('/');
	});

	it('外层 push 切走页面后内层卸载', async () => {
		let innerVm: any = null;
		const PageWithMemory = defineComponent({
			render: () => h(MemoryRouter, {
				ref: (el: any) => { innerVm = el; },
				routes: makeTabRoutes(),
			} as any),
		});
		const routes = [
			route({ path: '/', exact: false, component: PageWithMemory }),
			route({ path: '/other', exact: true, component: PageOther }),
		];
		const { container, vm } = mountOuter(HistoryPathRouter, routes);
		expect(container.querySelector('.tab-a')).not.toBeNull();
		vm.push('/other');
		await nextTick();
		expect(container.querySelector('.page-other')).not.toBeNull();
		expect(container.querySelector('.tab-a')).toBeNull();
	});

	it('内层 back/forward 在内存栈内独立运作', async () => {
		let innerVm: any = null;
		const PageWithMemory = defineComponent({
			render: () => h(MemoryRouter, {
				ref: (el: any) => { innerVm = el; },
				routes: makeTabRoutes(),
			} as any),
		});
		const routes = [
			route({ path: '/', exact: false, component: PageWithMemory }),
		];
		const { container } = mountOuter(HistoryPathRouter, routes);
		innerVm.push('/b');
		await nextTick();
		expect(container.querySelector('.tab-b')).not.toBeNull();
		innerVm.back();
		await nextTick();
		expect(container.querySelector('.tab-a')).not.toBeNull();
		expect(location.pathname).toBe('/');
	});
});

describe('HistoryPathRouter > HistoryHashRouter', () => {
	it('外层 pathname 决定页面，内层 hash 决定 tab', () => {
		let innerVm: any = null;
		const PageWithHash = defineComponent({
			render: () => h(HistoryHashRouter, {
				ref: (el: any) => { innerVm = el; },
				routes: makeTabRoutes(),
			} as any),
		});
		const routes = [
			route({ path: '/', exact: false, component: PageWithHash }),
			route({ path: '/other', exact: true, component: PageOther }),
		];
		setUrl('/#/b');
		const { container } = mountOuter(HistoryPathRouter, routes);
		expect(container.querySelector('.tab-b')).not.toBeNull();
		expect(location.pathname).toBe('/');
	});

	it('内层 push 改 hash 不改 pathname', async () => {
		let innerVm: any = null;
		const PageWithHash = defineComponent({
			render: () => h(HistoryHashRouter, {
				ref: (el: any) => { innerVm = el; },
				routes: makeTabRoutes(),
			} as any),
		});
		const routes = [
			route({ path: '/', exact: false, component: PageWithHash }),
		];
		setUrl('/');
		const { container } = mountOuter(HistoryPathRouter, routes);
		innerVm.push('/b');
		await nextTick();
		expect(container.querySelector('.tab-b')).not.toBeNull();
		expect(location.pathname).toBe('/');
		expect(location.hash).toBe('#/b');
	});

	it('外层 push 切走页面，内层 hash router 卸载', async () => {
		let innerVm: any = null;
		const PageWithHash = defineComponent({
			render: () => h(HistoryHashRouter, {
				ref: (el: any) => { innerVm = el; },
				routes: makeTabRoutes(),
			} as any),
		});
		const routes = [
			route({ path: '/', exact: false, component: PageWithHash }),
			route({ path: '/other', exact: true, component: PageOther }),
		];
		setUrl('/');
		const { container, vm } = mountOuter(HistoryPathRouter, routes);
		expect(container.querySelector('.tab-a')).not.toBeNull();
		vm.push('/other');
		await nextTick();
		expect(container.querySelector('.page-other')).not.toBeNull();
		expect(container.querySelector('.tab-a')).toBeNull();
	});
});

describe('HistoryHashRouter > MemoryRouter', () => {
	it('外层 hash 决定页面，内层内存决定 tab', () => {
		let innerVm: any = null;
		const PageWithMemory = defineComponent({
			render: () => h(MemoryRouter, {
				ref: (el: any) => { innerVm = el; },
				routes: makeTabRoutes(),
			} as any),
		});
		const routes = [
			route({ path: '/', exact: false, component: PageWithMemory }),
			route({ path: '/other', exact: true, component: PageOther }),
		];
		setUrl('#/');
		const { container } = mountOuter(HistoryHashRouter, routes);
		expect(container.querySelector('.tab-a')).not.toBeNull();
	});

	it('内层 push 不改外层 hash', async () => {
		let innerVm: any = null;
		const PageWithMemory = defineComponent({
			render: () => h(MemoryRouter, {
				ref: (el: any) => { innerVm = el; },
				routes: makeTabRoutes(),
			} as any),
		});
		const routes = [
			route({ path: '/', exact: false, component: PageWithMemory }),
		];
		setUrl('#/');
		const { container } = mountOuter(HistoryHashRouter, routes);
		innerVm.push('/b');
		await nextTick();
		expect(container.querySelector('.tab-b')).not.toBeNull();
		expect(location.hash).toBe('#/');
	});

	it('外层 push 切走页面后内层卸载', async () => {
		let innerVm: any = null;
		const PageWithMemory = defineComponent({
			render: () => h(MemoryRouter, {
				ref: (el: any) => { innerVm = el; },
				routes: makeTabRoutes(),
			} as any),
		});
		const routes = [
			route({ path: '/', exact: false, component: PageWithMemory }),
			route({ path: '/other', exact: true, component: PageOther }),
		];
		setUrl('#/');
		const { container, vm } = mountOuter(HistoryHashRouter, routes);
		expect(container.querySelector('.tab-a')).not.toBeNull();
		vm.push('/other');
		await nextTick();
		expect(container.querySelector('.page-other')).not.toBeNull();
		expect(container.querySelector('.tab-a')).toBeNull();
	});
});

describe('三层嵌套 HistoryPathRouter > HistoryHashRouter > MemoryRouter', () => {
	it('三层各自独立切换', async () => {
		let middleVm: any = null;
		let innerVm: any = null;
		const PageWithMemory = defineComponent({
			render: () => h(MemoryRouter, {
				ref: (el: any) => { innerVm = el; },
				routes: makeTabRoutes(),
			} as any),
		});
		const PageWithHash = defineComponent({
			render: () => h(HistoryHashRouter, {
				ref: (el: any) => { middleVm = el; },
				routes: [
					route({ path: '/', exact: true, component: TabA }),
					route({ path: '/sub', exact: false, component: PageWithMemory }),
				],
			} as any),
		});
		const routes = [
			route({ path: '/', exact: false, component: PageWithHash }),
			route({ path: '/other', exact: true, component: PageOther }),
		];
		setUrl('/');
		const { container, vm } = mountOuter(HistoryPathRouter, routes);
		expect(container.querySelector('.tab-a')).not.toBeNull();
		middleVm.push('/sub');
		await nextTick();
		expect(container.querySelector('.tab-a')).not.toBeNull();
		expect(innerVm).not.toBeNull();
		innerVm.push('/b');
		await nextTick();
		expect(container.querySelector('.tab-b')).not.toBeNull();
		expect(location.pathname).toBe('/');
		expect(location.hash).toBe('#/sub');
		vm.push('/other');
		await nextTick();
		expect(container.querySelector('.page-other')).not.toBeNull();
		expect(container.querySelector('.tab-b')).toBeNull();
	});
});
