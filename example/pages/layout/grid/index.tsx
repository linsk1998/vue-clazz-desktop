import { Page } from "@ting-ui/vue-desktop";
import { createComponent, ViewModel } from "vue-clazz-decorator";
import GridApiCard from "./GridApiCard";
import GridDemoCard from "./GridDemoCard";

@ViewModel
class GridDemoPageVM {
}

function GridDemoPageView() {
	return <Page>
		<GridDemoCard />
		<GridApiCard />
	</Page>;
}

export default createComponent(GridDemoPageView, GridDemoPageVM);
