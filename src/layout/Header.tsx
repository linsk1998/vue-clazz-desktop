import type { CSSProperties } from "vue";
import { useChildren } from "vue-clazz-decorator";

/** 顶部布局的参数 */
export interface HeaderProps {
	/** 自定义样式类 */
	class?: string;
	/** 样式 */
	style?: CSSProperties;
	/** 是否水平可滚动 */
	scrollX?: boolean;
	/** 是否垂直可滚动 */
	scrollY?: boolean;
	/** 宽度 */
	height?: number;
}

/** 布局-顶部
 * @remarks
 * 顶部布局，自带默认样式，其下可嵌套任何元素，只能放在 Layout 中。
 * @example
 * ```tsx
 * import { Layout, Header } from "@ting-ui/vue-desktop"
 * <Layout>
 * 	<Header>Header</Header>
 * </Layout>
 * ```
 */
export function Header(props: HeaderProps) {
	var { class: className, style, scrollX, scrollY, height } = props;
	var classList = ["row-shrink"];
	if(className) classList.push(className);
	if(scrollX) {
		classList.push("overflow-x-auto");
	}
	if(scrollY) {
		classList.push("overflow-y-auto");
	}
	if(height) {
		if(style) {
			style = { ...style, height };
		} else {
			style = { height };
		}
	}
	const children = useChildren();
	return <div class={classList.join(" ")} style={style}>{children}</div>;
}
