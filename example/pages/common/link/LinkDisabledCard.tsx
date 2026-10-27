import { Link } from "@ting-ui/vue-desktop";
import * as module from "module";

export default function LinkDisabledCard() {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>置灰状态</h4>
			<Link disabled>默认按钮</Link>
			{"\u00A0"}
			<Link type="primary" disabled>主要按钮</Link>
			{"\u00A0"}
			<Link type="success" disabled>成功按钮</Link>
			{"\u00A0"}
			<Link type="info" disabled>信息按钮</Link>
			{"\u00A0"}
			<Link type="warning" disabled>警告按钮</Link>
			{"\u00A0"}
			<Link type="danger" disabled>危险按钮</Link>
		</div>
	</div>;
}
