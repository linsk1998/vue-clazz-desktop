import { Page } from "@ting-ui/vue-desktop";
import { createComponent, ViewModel } from "vue-clazz-decorator";
import DemoCheckboxCard from "./DemoCheckboxCard";
import DemoRadioCard from "./DemoRadioCard";
import DemoTextAreaCard from "./DemoTextAreaCard";
import DemoTextInputCard from "./DemoTextInputCard";

@ViewModel
class FormDemoPageVM {
}

function FormDemoPageView() {
	return <Page>
		<DemoTextInputCard />
		<DemoTextAreaCard />
		<DemoRadioCard />
		<DemoCheckboxCard />
	</Page>;
}

export default createComponent(FormDemoPageView, FormDemoPageVM);
