import NotFound from "@/pages/404";
import Home from "@/pages/Home";
import type { RouteRecordRaw } from "@ting-ui/vue-desktop";

var pages = import.meta.glob("../pages/**/index.tsx");

const routes: RouteRecordRaw[] = [
	...Object.entries(pages).map(([path, loadModule]) => ({
		path: path.replace(/^\.\.\/pages\/(demo)\//, "/").replace(/\/index\.tsx$/, "").replace(".tsx", ""),
		component: loadModule as any,
	})),
	{
		path: "/",
		exact: true,
		component: Home
	},
	{
		path: "",
		component: NotFound
	}
];

export default routes;
