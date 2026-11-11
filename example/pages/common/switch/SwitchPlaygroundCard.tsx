import { Form, FormItem, sleep, Switch, type SwitchVM } from "@ting-ui/vue-desktop";
import * as module from "module";
import { createComponent, State, ViewModel } from "vue-clazz-decorator";

@ViewModel
class SwitchPlaygroundCardVM {
	@State disabled = false;
	@State loading = false;
	@State value = false;

	async onClick(swc: SwitchVM, value: boolean) {
		console.log(value);
		await sleep(1000);
	}
}

function SwitchPlaygroundCardView(props: SwitchPlaygroundCardVM) {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>开关</h4>
			<Form layout="horizontal">
				<FormItem label="配置">
					<label class="checkbox-inline">
						<input type="checkbox" checked={props.disabled} onChange={e => props.disabled = (e.target as HTMLInputElement).checked} />
						禁用
					</label>
					<label class="checkbox-inline">
						<input type="checkbox" checked={props.loading} onChange={e => props.loading = (e.target as HTMLInputElement).checked} />
						加载中
					</label>
				</FormItem>
				<FormItem label="基本用法">
					<Switch value={props.value} loading={props.loading} disabled={props.disabled} onChange={v => props.value = v} />
				</FormItem>
				<FormItem label="非受控用法">
					<Switch defaultValue={true} onClick={props.onClick} disabled={props.disabled} />
				</FormItem>
			</Form>
		</div>
	</div>;
}

export default createComponent(SwitchPlaygroundCardView, SwitchPlaygroundCardVM);
