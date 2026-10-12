import { createComponent, Prop, Provide, useChildren } from "vue-clazz-decorator";

export class ConfigProviderVM {
	@Prop
	@Provide
	public onActionError: (error: any) => any;
}

export function ConfigProviderView(props: ConfigProviderVM) {
	return useChildren();
}

export const ConfigProvider = createComponent(ConfigProviderView, ConfigProviderVM);
