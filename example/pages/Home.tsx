import { createComponent, ViewModel } from "vue-clazz-decorator";

@ViewModel
class HomeVM {
}

function HomeView() {
	return <div>Home</div>;
}

export default createComponent(HomeView, HomeVM);
