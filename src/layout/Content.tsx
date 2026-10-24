import type { CSSProperties } from "vue";
import { useChildren } from "vue-clazz-decorator";

/** 内容部分的参数 */
export interface ContentProps {
	/** 自定义样式类 */
	class?: string;
	/** 样式 */
	style?: CSSProperties;
	/** 是否水平可滚动 */
	scrollX?: boolean;
	/** 是否垂直可滚动 */
	scrollY?: boolean;
}

/** 布局-中间部分
 * @remarks
 * 内容部分，自带默认样式，其下可嵌套任何元素，只能放在 Layout 中。
 * @example
 * ```tsx
 * import { Layout, Content } from "@ting-ui/vue-desktop"
 * <Layout>
 * 	<Content>Content</Content>
 * </Layout>
 * ```
 */
export function Content(props: ContentProps) {
	var { class: className, style, scrollX, scrollY } = props;
	var classList: string[] = [];
	if(className) classList.push(className);
	if(scrollX) {
		classList.push("overflow-x-auto");
	}
	if(scrollY) {
		classList.push("overflow-y-auto");
	}
	const children = useChildren();
	return <div class={classList.join(" ")} style={style}>{children}</div>;
}
