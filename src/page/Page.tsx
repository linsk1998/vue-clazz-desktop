import { createComponent, ViewModel } from "vue-clazz-decorator";

export interface PageProps {
	/** 是否自动占满 */
	fill?: boolean;
	/** 数据初始化时运行 */
	onInit?: (page: PageVM) => Promise<any>;
	/** 界面完成时运行 */
	onReady?: (page: PageVM) => any;
}

@ViewModel
export class PageVM {
	public props: PageProps;
}

export function PageView() {

}

export const Page = createComponent(PageView, PageVM);
