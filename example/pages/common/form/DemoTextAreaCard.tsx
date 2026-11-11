import { Form, FormItem, TextArea } from "@ting-ui/vue-desktop";
import * as module from "module";
import { createComponent, State, ViewModel } from "vue-clazz-decorator";

@ViewModel
class DemoTextAreaCardVM {
	@State disabled = false;
	@State invalid = false;
	@State text1 = "";
	@State text2 = "";
}

function DemoTextAreaCardView(props: DemoTextAreaCardVM) {
	return <div class="card">
		<div class="card-body">
			<a href={import.meta.env.VITE_SOURCE_URL + module.id} class="pull-right" target="_blank">源代码</a>
			<h4>文本域</h4>
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
				</FormItem>
				<FormItem label="基本用法">
					<TextArea value={props.text1} onChange={v => props.text1 = v} disabled={props.disabled} invalid={props.invalid} />
				</FormItem>
				<FormItem label="统计字数">
					<TextArea showCount maxCount={100} value={props.text2} onChange={v => props.text2 = v} disabled={props.disabled} invalid={props.invalid} />
				</FormItem>
			</Form>
		</div>
	</div>;
}

export default createComponent(DemoTextAreaCardView, DemoTextAreaCardVM);
