import { createComponent, ViewModel } from "vue-clazz-decorator";

@ViewModel
class NotFoundVM {
}

function NotFoundView() {
	return <div>Not Found</div>;
}

export default createComponent(NotFoundView, NotFoundVM);
