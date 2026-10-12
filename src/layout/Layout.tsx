import type { CSSProperties, VNode, VNodeTypes } from "vue";
import { h } from "vue";
import { useChildren } from "vue-clazz-decorator";
import { Aside } from "./Aside";
import { Content } from "./Content";
import { Header } from "./Header";

const orderMap = new Map<VNodeTypes, number>([
	[Aside, -1],
	[Content, 1],
	[Layout, 1],
]);

const MARGIN_LEVEL = {
	'xs': "1",
	'sm': "2",
	'md': "3",
	'lg': "4",
	'xl': "5",
} as const;

/** Layout 布局的参数 */
export interface LayoutProps {
	/** 自定义样式类 */
	class?: string;
	/** 样式 */
	style?: CSSProperties;
	/** 是否铺满全屏 */
	fill?: boolean;
	/** 间隙 */
	gutter?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/** 合并 class 与额外 class，返回新 props 对象 */
function withClass(child: VNode, extraClass: string): VNode {
	var origin = child.props?.class as string | undefined;
	var merged = origin ? origin + " " + extraClass : extraClass;
	return h(child.type as any, { ...child.props, class: merged, key: child.key }, child.children as any);
}

/** 合并 class 与 style，返回新 props 对象 */
function withClassStyle(child: VNode, extraClass: string, extraStyle: Record<string, any>): VNode {
	var origin = child.props?.class as string | undefined;
	var merged = origin ? origin + " " + extraClass : extraClass;
	var mergedStyle = { ...(child.props?.style || {}), ...extraStyle };
	return h(child.type as any, { ...child.props, class: merged, style: mergedStyle, key: child.key }, child.children as any);
}

/** 布局-整体
 * @remarks
 * 布局容器，其下可嵌套 Header Aside Content Footer 或 Layout 本身，可以放在任何父容器中。
 * @example
 * ```tsx
 * import { Layout, Header, Content } from "@ting-ui/vue-desktop"
 * <Layout fill>
 * 	<Header>顶栏</Header>
 * 	<Content>内容</Content>
 * </Layout>
 * ```
 */
export function Layout(props: LayoutProps) {
	var classList: string[] = [];
	var { fill } = props;
	if(fill) {
		classList.push("layout-full");
	}
	var children = (useChildren() || []).filter(c => c && typeof c.type !== "symbol") as VNode[];
	/** 方向垂直 */
	var layoutV = false;
	/** 方向水平 */
	var layoutH = false;
	for(let item of children) {
		if(item.type === Header) {
			layoutV = true;
		} else if(item.type === Aside) {
			layoutH = true;
		}
	}
	if(!layoutV && !layoutH) {
		if(import.meta.env.DEV) {
			classList.push("text-danger");
			return <div class={classList.join(" ")}>布局错误：缺少顶栏或底栏或侧栏</div>;
		}
		return <div class={classList.join(" ")}>{children}</div>;
	} else if(layoutV && layoutH) {
		if(import.meta.env.DEV) {
			classList.push("text-danger");
			return <div class={classList.join(" ")}>布局错误：侧栏不能和顶栏或底栏同时出现</div>;
		}
		return <div class={classList.join(" ")}>{children}</div>;
	} else if(layoutV) {
		classList.push("col-flex");
		let items = children.map((item: VNode) => {
			if(item.type === Layout) {
				return withClass(item, "row-grow");
			} else if(item.type === Content) {
				return withClass(item, "row-grow");
			} else if(item.type === Header) {
				return item;
			}
			return null;
		}).filter(Boolean);
		return <div class={classList.join(" ")} style={props.style}>{items}</div>;
	} else if(layoutH) {
		classList.push("row-flex");
		let hasContent = false;
		let items = children.map((item: VNode) => {
			if(item.type === Layout) {
				hasContent = true;
				return withClass(item, "col-center");
			} else if(item.type === Content) {
				hasContent = true;
				return withClass(item, "col-center");
			} else if(item.type === Aside) {
				let gutter = props.gutter;
				let extraClass: string;
				let extraStyle: Record<string, any> = {};
				if(hasContent) {
					extraClass = "col-right";
					if(gutter) {
						if(typeof gutter === "number") {
							extraStyle.marginLeft = gutter;
						} else {
							extraClass += " ml-" + MARGIN_LEVEL[gutter];
						}
					}
				} else {
					extraClass = "col-left";
					if(gutter) {
						if(typeof gutter === "number") {
							extraStyle.marginRight = gutter;
						} else {
							extraClass += " mr-" + MARGIN_LEVEL[gutter];
						}
					}
				}
				return withClassStyle(item, extraClass, extraStyle);
			}
			return null;
		}).filter(Boolean);
		items.sort((a, b) => orderMap.get(a.type) - orderMap.get(b.type));
		return <div class={classList.join(" ")} style={props.style}>{items}</div>;
	}
}
