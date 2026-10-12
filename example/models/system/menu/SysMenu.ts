import { Model } from "vue-clazz-decorator";
import { PlatId } from "../plat/SysPlat";

export type MenuId = number;

@Model
export default class SysMenu {
	/** 菜单ID */
	// @Primary
	// @Render(false)
	// @Label("菜单ID")
	public menuId: MenuId;

	/** 父菜单ID */
	// @Label("父菜单ID")
	// @Render(false)
	// @Rule({ required: true })
	public parentId: MenuId;

	/** 菜单名称 */
	// @Label("菜单名称")
	// @Render(true)
	// @TableData({ render: MenuName })
	// @Rule({ required: true })
	// @Rule({ validator: varchar(50) })
	public menuName: string;

	/** 权限字符串 */
	// @Label("权限字符串")
	// @Render(false, true, true)
	// @Rule({ validator: varchar(100) })
	public perms?: string;

	/** 菜单图标 */
	// @Label("菜单图标")
	// @Render(false, true, true)
	// @Rule({ validator: varchar(100) })
	// @Editor('icon')
	public icon?: string;

	/** 显示顺序 */
	// @Label("显示顺序")
	// @Render(true)
	// @Rule({ required: true })
	// @Rule({ validator: number(4) })
	public orderNum?: string;

	/** 路由地址 */
	// @Label("路由地址")
	// @Render(false, true, true)
	// @Rule({ required: true })
	// @Rule({ validator: varchar(200) })
	public path?: string;

	/** 组件路径 */
	// @Label("组件路径")
	// @Render(false, false, true)
	// @Rule({ validator: varchar(255) })
	public component?: string;

	/** 是否为外链（0是 1否） */
	// @Label("是否为外链")
	// @Render(false, false, true)
	// @Dict({
	// 	'0': "是",
	// 	'1': "否"
	// })
	public isFrame?: string;

	/** 是否缓存（0缓存 1不缓存） */
	// @Render(false, false, true)
	// @Label("是否缓存")
	// @Dict({
	// 	'0': "缓存",
	// 	'1': "不缓存"
	// })
	public isCache?: string;

	/** 类型（M目录 C菜单 F按钮） */
	// @Render(false, false, true)
	// @Label("类型")
	// @Dict({
	// 	'M': "目录",
	// 	'C': "菜单",
	// 	'F': "按钮"
	// })
	// @Editor('radio')
	public menuType?: 'M' | 'C' | 'F';

	/** 自定义参数 */
	// @Render(false, false, true)
	// @Label("类型")
	// @Dict({
	// 	'M': "目录",
	// 	'C': "菜单",
	// 	'F': "按钮"
	// })
	// @Editor('radio')
	public query?: string;

	/** 显示状态（0显示 1隐藏） */
	// @Label("显示状态")
	// @Dict('sys_show_hide')
	// @Render(false, false, true)
	public visible?: string;

	/** 菜单状态（0显示 1隐藏） */
	// @Label("菜单状态")
	// @Render(false, false, true)
	// @Dict('sys_normal_disable')
	public status?: string;

	public platId?: PlatId;

	public children?: SysMenu[];
}
