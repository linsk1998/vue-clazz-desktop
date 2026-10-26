import { Button, ToolBar } from "@ting-ui/vue-desktop";
import * as module from "module";

export default function ButtonTypeDemoCard() {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>语境情景</h4>
			<ToolBar>
				<Button>默认按钮</Button>
				<Button type="primary">主要按钮</Button>
				<Button type="success">成功按钮</Button>
				<Button type="info">信息按钮</Button>
				<Button type="warning">警告按钮</Button>
				<Button type="danger">危险按钮</Button>
			</ToolBar>
			<h4>轮廓按钮</h4>
			<ToolBar>
				<Button outline>默认按钮</Button>
				<Button type="primary" outline>主要按钮</Button>
				<Button type="success" outline>成功按钮</Button>
				<Button type="info" outline>信息按钮</Button>
				<Button type="warning" outline>警告按钮</Button>
				<Button type="danger" outline>危险按钮</Button>
			</ToolBar>
		</div>
	</div>;
}
