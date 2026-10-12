import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { createApp, h } from "vue";
import { Button } from "../../src/button/Button";
import { server } from "../helpers/server";

function flushPromises() {
	return new Promise(r => setTimeout(r, 0));
}

function mountButton(props: Record<string, any> | null, slots?: () => any) {
	const container = document.createElement("div");
	const app = createApp({
		setup() {
			return () => h(Button, props, slots);
		},
	});
	app.mount(container);
	return container;
}

function deferred() {
	let resolve!: (value: any) => void;
	const promise = new Promise<any>(r => { resolve = r; });
	return { promise, resolve };
}

describe("Button ajax loading", () => {
	it("请求中 requests=1 且图标显示 loading-circular，响应后 requests=0 且图标恢复", async () => {
		const { promise, resolve } = deferred();
		server.use(http.get("/api/test", () => promise));

		let vm: any;
		const onClick = ({ component, ajax }: any) => {
			vm = component;
			return ajax.get("/api/test");
		};
		const container = mountButton({ icon: "home", onClick });

		container.querySelector("button")!.click();
		await flushPromises();

		expect(vm.requests).toBe(1);
		const iLoading = container.querySelector("i")!;
		expect(iLoading.classList.contains("loading-circular")).toBe(true);
		expect(iLoading.classList.contains("fa-home")).toBe(false);

		resolve(HttpResponse.json({ ok: true }));
		await flushPromises();

		expect(vm.requests).toBe(0);
		const iNormal = container.querySelector("i")!;
		expect(iNormal.classList.contains("loading-circular")).toBe(false);
		expect(iNormal.classList.contains("fa-home")).toBe(true);
	});

	it("请求失败后 requests 同样归零", async () => {
		const { promise, resolve } = deferred();
		server.use(http.get("/api/fail", () => promise));

		let vm: any;
		const onClick = ({ component, ajax }: any) => {
			vm = component;
			return ajax.get("/api/fail");
		};
		const container = mountButton({ icon: "home", onClick });

		container.querySelector("button")!.click();
		await flushPromises();

		expect(vm.requests).toBe(1);

		resolve(HttpResponse.json(null, { status: 500 }));
		await flushPromises();

		expect(vm.requests).toBe(0);
	});

	it("请求中 button disabled 且添加 btn-loading class", async () => {
		const { promise, resolve } = deferred();
		server.use(http.get("/api/test", () => promise));

		const onClick = ({ ajax }: any) => ajax.get("/api/test");
		const container = mountButton({ icon: "home", onClick });

		container.querySelector("button")!.click();
		await flushPromises();

		const btn = container.querySelector("button")!;
		expect(btn.disabled).toBe(true);
		expect(btn.classList.contains("btn-loading")).toBe(true);

		resolve(HttpResponse.json({}));
		await flushPromises();

		expect(container.querySelector("button")!.disabled).toBe(false);
		expect(container.querySelector("button")!.classList.contains("btn-loading")).toBe(false);
	});

	it("无 icon 时请求中不渲染 loading 图标", async () => {
		const { promise, resolve } = deferred();
		server.use(http.get("/api/test", () => promise));

		const onClick = ({ ajax }: any) => ajax.get("/api/test");
		const container = mountButton({ onClick });

		container.querySelector("button")!.click();
		await flushPromises();

		expect(container.querySelector("i")).toBeNull();

		resolve(HttpResponse.json({}));
		await flushPromises();
	});

	it("多个并发请求 requests 累加，全部完成后归零", async () => {
		const reqA = deferred();
		const reqB = deferred();
		server.use(
			http.get("/api/a", () => reqA.promise),
			http.get("/api/b", () => reqB.promise),
		);

		let vm: any;
		const onClick = ({ component, ajax }: any) => {
			vm = component;
			return Promise.all([
				ajax.get("/api/a"),
				ajax.get("/api/b"),
			]);
		};
		const container = mountButton({ icon: "home", onClick });

		container.querySelector("button")!.click();
		await flushPromises();

		expect(vm.requests).toBe(2);

		reqA.resolve(HttpResponse.json({}));
		await flushPromises();
		expect(vm.requests).toBe(1);

		reqB.resolve(HttpResponse.json({}));
		await flushPromises();
		expect(vm.requests).toBe(0);
	});
});
