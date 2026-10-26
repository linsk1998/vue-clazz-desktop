import { Button, ToolBar, sleep, type ButtonCallback } from "@ting-ui/vue-desktop";
import * as module from "module";

const onClick: ButtonCallback<MouseEvent> = async ({ ajax }) => {
	await sleep(1000);
	await ajax.get("/getInfo");
};

export default function ButtonLoadingDemoCard() {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>手动控制加载效果</h4>
			<ToolBar>
				<Button loading icon="loading-circular" type="primary">新增</Button>
				<Button loading icon="loading-circular" type="primary">修改</Button>
				<Button loading icon="loading-circular" type="primary">查询</Button>
				<Button loading icon="loading-circular" type="danger">删除</Button>
			</ToolBar>
			<h4>自动控制加载效果</h4>
			<ToolBar>
				<Button icon="plus" type="primary" onClick={onClick}>新增</Button>
				<Button icon="pencil-square-o" type="primary" onClick={onClick}>修改</Button>
				<Button icon="search" type="primary" onClick={onClick}>查询</Button>
				<Button icon="trash-o" type="danger" onClick={onClick}>删除</Button>
			</ToolBar>
		</div>
	</div>;
}
