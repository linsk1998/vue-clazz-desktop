import { Button, ToolBar } from "@ting-ui/vue-desktop";
import * as module from "module";

export default function ButtonSizeDemoCard() {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>不同尺寸</h4>
			<ToolBar>
				<Button>默认按钮</Button>
				<Button type="primary">主要按钮</Button>
				<Button type="success">成功按钮</Button>
				<Button type="info">信息按钮</Button>
				<Button type="warning">警告按钮</Button>
				<Button type="danger">危险按钮</Button>
			</ToolBar>
			<h4>大</h4>
			<ToolBar>
				<Button size="lg">默认按钮</Button>
				<Button size="lg" type="primary">主要按钮</Button>
				<Button size="lg" type="success">成功按钮</Button>
				<Button size="lg" type="info">信息按钮</Button>
				<Button size="lg" type="warning">警告按钮</Button>
				<Button size="lg" type="danger">危险按钮</Button>
			</ToolBar>
			<h4>小</h4>
			<ToolBar>
				<Button size="sm">默认按钮</Button>
				<Button size="sm" type="primary">主要按钮</Button>
				<Button size="sm" type="success">成功按钮</Button>
				<Button size="sm" type="info">信息按钮</Button>
				<Button size="sm" type="warning">警告按钮</Button>
				<Button size="sm" type="danger">危险按钮</Button>
			</ToolBar>
			<h4>超小</h4>
			<ToolBar>
				<Button size="xs">默认按钮</Button>
				<Button size="xs" type="primary">主要按钮</Button>
				<Button size="xs" type="success">成功按钮</Button>
				<Button size="xs" type="info">信息按钮</Button>
				<Button size="xs" type="warning">警告按钮</Button>
				<Button size="xs" type="danger">危险按钮</Button>
			</ToolBar>
		</div>
	</div>;
}
