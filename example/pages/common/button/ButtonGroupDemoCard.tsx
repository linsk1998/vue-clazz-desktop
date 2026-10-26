import { Button, ToolBar } from "@ting-ui/vue-desktop";
import * as module from "module";

export default function ButtonGroupDemoCard() {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>按钮组</h4>
			<ToolBar>
				<Button type="primary">新增</Button>
				<Button>修改</Button>
				<div class="btn-group">
					<Button>导入</Button>
					<Button>导出</Button>
					<Button>模板</Button>
				</div>
				<Button type="danger">删除</Button>
			</ToolBar>
		</div>
	</div>;
}
