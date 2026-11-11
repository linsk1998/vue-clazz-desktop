import { createComponent, OnDidCatch, Prop, State, useChildren, ViewModel } from "vue-clazz-decorator";
import { ErrorDisplay } from "../views/ErrorDisplay";

export interface PageProps {
	/** 是否自动占满 */
	fill?: boolean;
	/** 数据初始化时运行 */
	onInit?: (page: PageVM) => Promise<any>;
	/** 界面完成时运行 */
	onReady?: (page: PageVM) => any;
	/** 关闭时运行， 返回 false 可以阻止关闭 */
	onClose?: (page: PageVM) => boolean | void;
	/** title 标题 */
	title?: string;
}

@ViewModel
export class PageVM {
	@Prop
	public fill?: boolean;
	/** 强制关闭页面 */
	public close() {
	}
	@State
	public error?: Error;
	@OnDidCatch
	public onError(e: Error) {
		this.error = e;
		return false;
	}
}

export function PageView(props: PageVM) {
	var { error, fill } = props;
	var children = useChildren();
	var classList = ['page'];
	if(fill) {
		classList.push('page-fill');
	}
	return <div class={classList.join(' ')}>{
		error ?
			<ErrorDisplay error={error} fill={fill} /> :
			children
	}</div>;
}

export const Page = createComponent<PageProps, PageVM>(PageView, PageVM);
