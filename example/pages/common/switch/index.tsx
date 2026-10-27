import { Page } from "@ting-ui/vue-desktop";
import { createComponent, ViewModel } from "vue-clazz-decorator";
import PlaygroundCard from "./PlaygroundCard";
import SwitchApiCard from "./SwitchApiCard";

@ViewModel
class SwitchDemoPageVM {
}

function SwitchDemoPageView() {
	return <Page>
		<PlaygroundCard />
		<SwitchApiCard />
	</Page>;
}

export default createComponent(SwitchDemoPageView, SwitchDemoPageVM);
