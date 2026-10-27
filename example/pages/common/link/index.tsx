import { Page } from "@ting-ui/vue-desktop";
import { createComponent, ViewModel } from "vue-clazz-decorator";
import LinkApiCard from "./LinkApiCard";
import LinkDisabledCard from "./LinkDisabledCard";
import LinkIconCard from "./LinkIconCard";
import LinkTypeCard from "./LinkTypeCard";

@ViewModel
class LinkPageVM {
}

function LinkPageView() {
	return <Page>
		<LinkTypeCard />
		<LinkDisabledCard />
		<LinkIconCard />
		<LinkApiCard />
	</Page>;
}

export default createComponent(LinkPageView, LinkPageVM);
