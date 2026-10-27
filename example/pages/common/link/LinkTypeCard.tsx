import { Link } from "@ting-ui/vue-desktop";
import * as module from "module";

export default function LinkTypeCard() {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>情景语境</h4>
			<Link>默认按钮</Link>
			{"\u00A0"}
			<Link type="primary">主要按钮</Link>
			{"\u00A0"}
			<Link type="success">成功按钮</Link>
			{"\u00A0"}
			<Link type="info">信息按钮</Link>
			{"\u00A0"}
			<Link type="warning">警告按钮</Link>
			{"\u00A0"}
			<Link type="danger">危险按钮</Link>
		</div>
	</div>;
}
