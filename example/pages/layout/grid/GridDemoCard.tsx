import { Col, Row } from "@ting-ui/vue-desktop";
import * as module from "module";

export default function GridDemoCard() {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h2 class="page-header">12栅格</h2>
			<Row class="my-2">
				<Col span={12}>
					<div class="bg-primary text-center">12格</div>
				</Col>
			</Row>
			<Row class="my-2">
				<Col span={6}>
					<div class="bg-primary text-center">6格</div>
				</Col>
				<Col span={6}>
					<div class="bg-info text-center">6格</div>
				</Col>
			</Row>
			<Row class="my-2">
				<Col span={4}>
					<div class="bg-primary text-center">4格</div>
				</Col>
				<Col span={4}>
					<div class="bg-info text-center">4格</div>
				</Col>
				<Col span={4}>
					<div class="bg-primary text-center">4格</div>
				</Col>
			</Row>
			<Row class="my-2">
				<Col span={1}>
					<div class="bg-primary text-center">1格</div>
				</Col>
				<Col span={11}>
					<div class="bg-info text-center">11格</div>
				</Col>
			</Row>
			<Row class="my-2">
				<Col span={4}>
					<div class="bg-primary text-center">4格</div>
				</Col>
				<Col span={8}>
					<div class="bg-info text-center">8格</div>
				</Col>
			</Row>

			<h2 class="page-header">区间间隔</h2>
			<Row class="my-2" gutter="lg">
				<Col span={4}>
					<div class="bg-primary text-center">4格 间隔lg</div>
				</Col>
				<Col span={4}>
					<div class="bg-info text-center">4格 间隔lg</div>
				</Col>
				<Col span={4}>
					<div class="bg-primary text-center">4格 间隔lg</div>
				</Col>
			</Row>
			<Row class="my-2" gutter="md">
				<Col span={4}>
					<div class="bg-primary text-center">4格 间隔md</div>
				</Col>
				<Col span={4}>
					<div class="bg-info text-center">4格 间隔md</div>
				</Col>
				<Col span={4}>
					<div class="bg-primary text-center">4格 间隔md</div>
				</Col>
			</Row>

			<h2 class="page-header">offset偏移</h2>
			<Row class="my-2">
				<Col span={10} offset={2}>
					<div class="bg-primary text-center">10格,偏移2格</div>
				</Col>
			</Row>
			<Row class="my-2">
				<Col span={1} offset={1}>
					<div class="bg-primary text-center">1格 偏移1格</div>
				</Col>
				<Col span={1} offset={8}>
					<div class="bg-info text-center">1格 偏移8格</div>
				</Col>
			</Row>

			<h2 class="page-header">栅格排序</h2>
			<Row>
				<Col span={8} push={2}>
					<div class="bg-primary text-center">8格,push2格,center</div>
				</Col>
				<Col span={2} pull={8}>
					<div class="bg-info text-center">1格,pull8格,left</div>
				</Col>
				<Col span={2}>
					<div class="bg-success text-center">2格 right</div>
				</Col>
			</Row>
		</div>
	</div>;
}
