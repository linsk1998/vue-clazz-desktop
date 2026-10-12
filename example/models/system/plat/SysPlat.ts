import { Model } from "vue-clazz-decorator";

export type PlatId = number;

@Model
export default class SysPlat {
	public platId: PlatId;
	public platName: string;
}
