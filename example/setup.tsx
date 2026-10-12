import { iconSetup } from "@ting-ui/vue-desktop";

iconSetup({
	renderIcon(iconName, className, arialabel) {
		return <i class={className + ' fa fa-' + iconName} aria-hidden="true" aria-label={arialabel || iconName} />;
	}
});
