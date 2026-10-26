import { Button, ToolBar } from "@ting-ui/vue-desktop";
import * as module from "module";

export default function ButtonDisabledDemoCard() {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>置灰状态</h4>
			<ToolBar>
				<Button disabled>默认按钮</Button>
				<Button disabled type="primary">主要按钮</Button>
				<Button disabled type="success">成功按钮</Button>
				<Button disabled type="info">信息按钮</Button>
				<Button disabled type="warning">警告按钮</Button>
				<Button disabled type="danger">危险按钮</Button>
			</ToolBar>
			<ToolBar>
				<Button disabled outline>默认按钮</Button>
				<Button disabled type="primary" outline>主要按钮</Button>
				<Button disabled type="success" outline>成功按钮</Button>
				<Button disabled type="info" outline>信息按钮</Button>
				<Button disabled type="warning" outline>警告按钮</Button>
				<Button disabled type="danger" outline>危险按钮</Button>
			</ToolBar>
		</div>
	</div>;
}
