import { HistoryHashRouter } from "@ting-ui/vue-desktop";
import { createApp, provide } from "vue";
import routes from "./data/routes";
import App from "./layouts/App";
import NotFound from "./pages/404";
import Home from "./pages/Home";
import "./setup";
import request from "./utils/request";

const el = document.getElementById("root");
el.className = "app";

createApp({
	setup() {
		provide('ajax', request);
	},
	render() {
		return <HistoryHashRouter ref="router" routes={[
			{
				path: "", component: App, children: [
					...routes,
					{ path: "", component: Home },
					{ path: "", component: NotFound }
				]
			}
		]} />;
	}
}, {}).mount(el);
