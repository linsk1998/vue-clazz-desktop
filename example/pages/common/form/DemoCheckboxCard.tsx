import { Checkbox, CheckboxGroup, EnvError, Form, FormItem, type OptionSelect } from "@ting-ui/vue-desktop";
import * as module from "module";
import { createComponent, State, ViewModel } from "vue-clazz-decorator";

const options: OptionSelect[] = [
	{ label: "苹果", value: 1 },
	{ label: "香蕉", value: 2 },
	{ label: "菠萝", value: 3, disabled: true }
];

@ViewModel
class DemoCheckboxCardVM {
	@State disabled = false;
	@State invalid = false;
	@State loading = false;
	@State error: Error | undefined = undefined;
	@State indeterminate = false;
	@State value1 = false;
	@State value2 = false;
	@State value3 = false;
	@State values: any[] = [];

	reload() {
		this.error = undefined;
		this.loading = true;
	}
}

function DemoCheckboxCardView(props: DemoCheckboxCardVM) {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>多选框</h4>
			<Form layout="horizontal" validated={props.invalid}>
				<FormItem label="配置">
					<label class="checkbox-inline">
						<input type="checkbox" checked={props.disabled} onChange={e => props.disabled = (e.target as HTMLInputElement).checked} />
						禁用
					</label>
					<label class="checkbox-inline">
						<input type="checkbox" checked={props.invalid} onChange={e => props.invalid = (e.target as HTMLInputElement).checked} />
						校验失败
					</label>
					<label class="checkbox-inline">
						<input type="checkbox" checked={props.loading} onChange={e => props.loading = (e.target as HTMLInputElement).checked} />
						加载中
					</label>
					<label class="checkbox-inline">
						<input type="checkbox" checked={!!props.error} onChange={e => props.error = (e.target as HTMLInputElement).checked ? new EnvError("网络异常") : undefined} />
						出错了
					</label>
					<label class="checkbox-inline">
						<input type="checkbox" checked={props.indeterminate} onChange={e => props.indeterminate = (e.target as HTMLInputElement).checked} />
						半选中
					</label>
				</FormItem>
				<FormItem label="多选按钮">
					<label class="checkbox-inline">
						<Checkbox name="text1" value="1" checked={props.value1} onChange={value => props.value1 = value} disabled={props.disabled} invalid={props.invalid} indeterminate={props.indeterminate} />
						<span class="vertical-align-middle">苹果</span>
					</label>
					<label class="checkbox-inline">
						<Checkbox name="text1" value="2" checked={props.value2} onChange={value => props.value2 = value} disabled={props.disabled} invalid={props.invalid} indeterminate={props.indeterminate} />
						<span class="vertical-align-middle">香蕉</span>
					</label>
					<label class="checkbox-inline">
						<Checkbox name="text1" value="3" checked={props.value3} onChange={value => props.value3 = value} disabled invalid={props.invalid} indeterminate={props.indeterminate} />
						<span class="vertical-align-middle disabled">菠萝</span>
					</label>
				</FormItem>
				<FormItem label="多选按钮组">
					<CheckboxGroup
						options={options}
						value={props.values}
						onChange={value => props.values = value}
						onReload={props.reload}
						disabled={props.disabled}
						invalid={props.invalid}
						loading={props.loading}
						error={props.error}
					/>
				</FormItem>
			</Form>
		</div>
	</div>;
}

export default createComponent(DemoCheckboxCardView, DemoCheckboxCardVM);
