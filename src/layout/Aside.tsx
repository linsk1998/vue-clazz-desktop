import type { CSSProperties } from "vue";
import { useChildren } from "vue-clazz-decorator";

/** 侧边栏的参数 */
export interface AsideProps {
	/** 自定义样式类 */
	class?: string;
	/** 样式 */
	style?: CSSProperties;
	/** 是否水平可滚动 */
	scrollX?: boolean;
	/** 是否垂直可滚动 */
	scrollY?: boolean;
	/** 宽度 */
	width?: number;
}

/** 布局-侧边
 * @remarks
 * 侧边栏，自带默认样式及基本功能，其下可嵌套任何元素，只能放在 Layout 中。
 * @example
 * ```tsx
 * import { Layout, Aside } from "@ting-ui/vue-desktop"
 * <Layout>
 * 	<Aside width={200}>Aside</Aside>
 * </Layout>
 * ```
 */
export function Aside(props: AsideProps) {
	var { scrollX, scrollY, width } = props;
	var classList = ["col-aside"];
	if(scrollX) {
		classList.push("overflow-x-auto");
	}
	if(scrollY) {
		classList.push("overflow-y-auto");
	}
	const children = useChildren();
	return <div class={classList.join(" ")} style={width ? { width } : null}>{children}</div>;
}
