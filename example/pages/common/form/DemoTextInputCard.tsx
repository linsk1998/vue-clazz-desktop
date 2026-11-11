import { Form, FormItem, TextInput } from "@ting-ui/vue-desktop";
import * as module from "module";
import { createComponent, State, ViewModel } from "vue-clazz-decorator";

@ViewModel
class DemoTextInputCardVM {
	@State disabled = false;
	@State invalid = false;
	@State text1 = "";
	@State text2 = "";
	@State text3 = "";
	@State text4 = "";
	@State text5 = "";
	@State text6 = "";
}

function DemoTextInputCardView(props: DemoTextInputCardVM) {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>文本框</h4>
			<Form layout="horizontal">
				<FormItem label="配置">
					<label class="checkbox-inline">
						<input type="checkbox" checked={props.disabled} onChange={e => props.disabled = (e.target as HTMLInputElement).checked} />
						禁用
					</label>
					<label class="checkbox-inline">
						<input type="checkbox" checked={props.invalid} onChange={e => props.invalid = (e.target as HTMLInputElement).checked} />
						校验失败
					</label>
				</FormItem>
				<FormItem label="基本用法">
					<TextInput value={props.text1} onChange={v => props.text1 = v} disabled={props.disabled} invalid={props.invalid} clearable />
				</FormItem>
				<FormItem label="内部文字">
					<TextInput suffix="%" value={props.text2} onChange={v => props.text2 = v} disabled={props.disabled} invalid={props.invalid} clearable />
				</FormItem>
				<FormItem label="外部文字">
					<TextInput append="万元" value={props.text3} onChange={v => props.text3 = v} disabled={props.disabled} invalid={props.invalid} clearable />
				</FormItem>
				<FormItem label="前后文字">
					<TextInput prepend="http://" prefix="www." suffix=".com" append="/index.html" value={props.text4} onChange={v => props.text4 = v} disabled={props.disabled} invalid={props.invalid} clearable />
				</FormItem>
				<FormItem label="统计字数">
					<TextInput showCount value={props.text5} onChange={v => props.text5 = v} disabled={props.disabled} invalid={props.invalid} clearable />
				</FormItem>
				<FormItem label="限制字数">
					<TextInput showCount maxCount={40} value={props.text6} onChange={v => props.text6 = v} disabled={props.disabled} invalid={props.invalid} clearable />
				</FormItem>
			</Form>
		</div>
	</div>;
}

export default createComponent(DemoTextInputCardView, DemoTextInputCardVM);
