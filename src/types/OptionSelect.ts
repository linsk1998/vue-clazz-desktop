export interface OptionSelect<T = any> {
	/** 展示标签 */
	label?: string;
	/** 真实值 */
	value?: string | number;
	/** 是否置灰 */
	disabled?: boolean;
	/** 是否隐藏控件 */
	hidden?: boolean;
	/** 自定义样式 */
	className?: string;
	/** 原始数据 */
	origin?: T;
}
