import { Page } from "@ting-ui/vue-desktop";
import { createComponent, ViewModel } from "vue-clazz-decorator";
import SwitchApiCard from "./SwitchApiCard";
import SwitchPlaygroundCard from "./SwitchPlaygroundCard";

@ViewModel
class SwitchDemoPageVM {
}

function SwitchDemoPageView() {
	return <Page>
		<SwitchPlaygroundCard />
		<SwitchApiCard />
	</Page>;
}

export default createComponent(SwitchDemoPageView, SwitchDemoPageVM);
