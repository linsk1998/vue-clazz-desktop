import { Page } from "@ting-ui/vue-desktop";
import { createComponent, ViewModel } from "vue-clazz-decorator";
import ButtonDisabledDemoCard from "./ButtonDisabledDemoCard";
import ButtonGroupDemoCard from "./ButtonGroupDemoCard";
import ButtonIconDemoCard from "./ButtonIconDemoCard";
import ButtonLoadingDemoCard from "./ButtonLoadingDemoCard";
import ButtonShapeDemoCard from "./ButtonShapeDemoCard";
import ButtonSizeDemoCard from "./ButtonSizeDemoCard";
import ButtonTypeDemoCard from "./ButtonTypeDemoCard";

@ViewModel
class ButtonDemoPageVM {
}

function ButtonDemoPageView() {
	return <Page>
		<ButtonTypeDemoCard />
		<ButtonDisabledDemoCard />
		<ButtonIconDemoCard />
		<ButtonLoadingDemoCard />
		<ButtonGroupDemoCard />
		<ButtonSizeDemoCard />
		<ButtonShapeDemoCard />
	</Page>;
}

export default createComponent(ButtonDemoPageView, ButtonDemoPageVM);
