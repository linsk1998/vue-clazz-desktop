import { EnvError, Form, FormItem, Radio, RadioGroup, type OptionSelect } from "@ting-ui/vue-desktop";
import * as module from "module";
import { createComponent, State, ViewModel } from "vue-clazz-decorator";

const options: OptionSelect[] = [
	{ label: "苹果", value: 1 },
	{ label: "香蕉", value: 2 },
	{ label: "菠萝", value: 3, disabled: true }
];

@ViewModel
class DemoRadioCardVM {
	@State disabled = false;
	@State invalid = false;
	@State loading = false;
	@State error: Error | undefined = undefined;
	@State value1 = "1";
	@State value2 = 0;

	reload() {
		this.error = undefined;
		this.loading = true;
	}
}

function DemoRadioCardView(props: DemoRadioCardVM) {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>单选框</h4>
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
				</FormItem>
				<FormItem label="单选按钮">
					<label class="radio-inline">
						<Radio name="text1" value="1" checked={props.value1 == '1'} onChange={() => props.value1 = '1'} disabled={props.disabled} invalid={props.invalid} />
						<span class="vertical-align-middle">苹果</span>
					</label>
					<label class="radio-inline">
						<Radio name="text1" value="2" checked={props.value1 == '2'} onChange={() => props.value1 = '2'} disabled={props.disabled} invalid={props.invalid} />
						<span class="vertical-align-middle">香蕉</span>
					</label>
					<label class="radio-inline">
						<Radio name="text1" value="3" checked={props.value1 == '3'} onChange={() => props.value1 = '3'} disabled invalid={props.invalid} />
						<span class="vertical-align-middle text-muted">菠萝</span>
					</label>
				</FormItem>
				<FormItem label="单选按钮组">
					<RadioGroup
						options={options}
						value={props.value2}
						onChange={value => props.value2 = value}
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

export default createComponent(DemoRadioCardView, DemoRadioCardVM);
