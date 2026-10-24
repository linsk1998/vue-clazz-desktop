import { createApp } from "vue";
import App from "./App";
import "./setup";

const el = document.getElementById("root");
el.className = "app";

createApp(App, {}).mount(el);
