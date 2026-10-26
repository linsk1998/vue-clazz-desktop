import { Button, ToolBar } from "@ting-ui/vue-desktop";
import * as module from "module";

export default function ButtonShapeDemoCard() {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>圆角</h4>
			<ToolBar>
				<Button shape="round">默认按钮</Button>
				<Button type="primary" shape="round">主要按钮</Button>
				<Button type="success" shape="round">成功按钮</Button>
				<Button type="info" shape="round">信息按钮</Button>
				<Button type="warning" shape="round">警告按钮</Button>
				<Button type="danger" shape="round">危险按钮</Button>
			</ToolBar>
			<h4>圆型</h4>
			<ToolBar>
				<Button icon="search" shape="circle"></Button>
				<Button icon="refresh" shape="circle"></Button>
				<Button type="primary" shape="circle">主</Button>
				<Button type="success" shape="circle">成</Button>
				<Button type="info" shape="circle">信</Button>
				<Button type="warning" shape="circle">警</Button>
				<Button type="danger" shape="circle">危</Button>
			</ToolBar>
		</div>
	</div>;
}
