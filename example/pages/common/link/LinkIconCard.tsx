import { Link } from "@ting-ui/vue-desktop";
import * as module from "module";

export default function LinkIconCard() {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>图标</h4>
			<Link icon="pencil">默认按钮</Link>
			{"\u00A0"}
			<Link icon="eye" type="primary">默认按钮</Link>
		</div>
	</div>;
}
