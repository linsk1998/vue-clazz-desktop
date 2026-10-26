import { Button, ToolBar } from "@ting-ui/vue-desktop";
import * as module from "module";

export default function ButtonIconDemoCard() {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>图标按钮</h4>
			<ToolBar>
				<Button icon="plus" type="primary">新增</Button>
				<Button icon="pencil-square-o" type="primary">修改</Button>
				<Button icon="search" type="primary">查询</Button>
				<Button icon="trash-o" type="danger">删除</Button>
			</ToolBar>
		</div>
	</div>;
}
