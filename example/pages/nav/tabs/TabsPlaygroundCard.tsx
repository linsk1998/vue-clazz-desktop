// import { Tab, Tabs } from "@ting-ui/vue-desktop";
// import * as module from "module";
// import { createComponent, State, ViewModel } from "vue-clazz-decorator";

// @ViewModel
// class TabsPlaygroundCardVM {
// 	@State tabType: 'pivot' | 'tabs' | 'pills' = "tabs";
// 	@State grow = false;
// 	@State justified = false;
// 	@State keepAlive = false;
// }

// function TabsPlaygroundCardView(props: TabsPlaygroundCardVM) {
// 	return <div class="card">
// 		<div class="card-body">
// 			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
// 			<h4>选项卡</h4>
// 			<div class="form-group">
// 				<label class="checkbox-inline">
// 					<input type="checkbox" checked={props.grow} onChange={e => props.grow = (e.target as HTMLInputElement).checked} />
// 					占满（grow）
// 				</label>
// 				<label class="checkbox-inline">
// 					<input type="checkbox" checked={props.justified} onChange={e => props.justified = (e.target as HTMLInputElement).checked} />
// 					均匀分配（justified）
// 				</label>
// 				<label class="checkbox-inline">
// 					<input type="checkbox" checked={props.keepAlive} onChange={e => props.keepAlive = (e.target as HTMLInputElement).checked} />
// 					保持活动（keepAlive）
// 				</label>
// 			</div>
// 			<div class="form-group">
// 				<label class="radio-inline">
// 					<input type="radio" name="tabType" checked={props.tabType == 'tabs'} onChange={() => props.tabType = 'tabs'} />
// 					tabs
// 				</label>
// 				<label class="radio-inline">
// 					<input type="radio" name="tabType" checked={props.tabType == 'pills'} onChange={() => props.tabType = 'pills'} />
// 					pills
// 				</label>
// 				<label class="radio-inline">
// 					<input type="radio" name="tabType" checked={props.tabType == 'pivot'} onChange={() => props.tabType = 'pivot'} />
// 					pivot
// 				</label>
// 			</div>
// 			<Tabs tabType={props.tabType} grow={props.grow} justified={props.justified}>
// 				<Tab value="1" label="首页" active>首页内容</Tab>
// 				<Tab value="2" label="列表" badge={5}>列表内容</Tab>
// 				<Tab value="3" label="详情" keepAlive={props.keepAlive}>详情内容</Tab>
// 				<Tab value="4" label="禁用" disabled>禁用内容</Tab>
// 			</Tabs>
// 		</div>
// 	</div>;
// }

// export default createComponent(TabsPlaygroundCardView, TabsPlaygroundCardVM);
