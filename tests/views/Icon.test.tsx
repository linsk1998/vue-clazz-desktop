import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { Icon, iconSetup } from '../../src/views/Icon';

/**
 * 默认渲染函数（用于每个用例执行后恢复全局 renderIcon，避免用例间相互污染）。
 */
function defaultRenderIcon(iconName: string, className: string, arialabel?: string) {
	return <i class={className + ' fa fa-' + iconName} aria-hidden="true" aria-label={arialabel || iconName} />;
}

describe('IconTest', () => {
	afterEach(() => {
		iconSetup({ renderIcon: defaultRenderIcon });
	});

	it('渲染基本图标，包含默认 class 与 aria 属性', () => {
		const wrapper = mount(Icon, { slots: { default: 'home' } });
		const i = wrapper.find('i');
		expect(i.exists()).toBe(true);
		expect(i.attributes('class')).toBe('icon fa fa-home');
		expect(i.attributes('aria-hidden')).toBe('true');
		expect(i.attributes('aria-label')).toBe('home');
	});

	it('省略 aria-label 时使用图标名作为 aria-label', () => {
		const wrapper = mount(Icon, { slots: { default: 'user' } });
		expect(wrapper.find('i').attributes('aria-label')).toBe('user');
	});

	it('自定义 aria-label 覆盖默认图标名', () => {
		const wrapper = mount(Icon, {
			props: { 'aria-label': '自定义标签' },
			slots: { default: 'home' },
		});
		expect(wrapper.find('i').attributes('aria-label')).toBe('自定义标签');
	});

	it('position="left" 添加 icon-left 类', () => {
		const wrapper = mount(Icon, { props: { position: 'left' }, slots: { default: 'home' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-left fa fa-home');
	});

	it('position="right" 添加 icon-right 类', () => {
		const wrapper = mount(Icon, { props: { position: 'right' }, slots: { default: 'home' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-right fa fa-home');
	});

	it('size="lg" 添加 icon-lg 类', () => {
		const wrapper = mount(Icon, { props: { size: 'lg' }, slots: { default: 'star' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-lg fa fa-star');
	});

	it('size="2x" 添加 icon-2x 类', () => {
		const wrapper = mount(Icon, { props: { size: '2x' }, slots: { default: 'star' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-2x fa fa-star');
	});

	it('size="3x" 添加 icon-3x 类', () => {
		const wrapper = mount(Icon, { props: { size: '3x' }, slots: { default: 'star' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-3x fa fa-star');
	});

	it('size="4x" 添加 icon-4x 类', () => {
		const wrapper = mount(Icon, { props: { size: '4x' }, slots: { default: 'star' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-4x fa fa-star');
	});

	it('size="5x" 添加 icon-5x 类', () => {
		const wrapper = mount(Icon, { props: { size: '5x' }, slots: { default: 'star' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-5x fa fa-star');
	});

	it('rotate=-90 添加 icon-rotate--90 类', () => {
		const wrapper = mount(Icon, { props: { rotate: -90 }, slots: { default: 'arrow' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-rotate--90 fa fa-arrow');
	});

	it('rotate=90 添加 icon-rotate-90 类', () => {
		const wrapper = mount(Icon, { props: { rotate: 90 }, slots: { default: 'arrow' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-rotate-90 fa fa-arrow');
	});

	it('rotate=180 添加 icon-rotate-180 类', () => {
		const wrapper = mount(Icon, { props: { rotate: 180 }, slots: { default: 'arrow' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-rotate-180 fa fa-arrow');
	});

	it('rotate=270 添加 icon-rotate-270 类', () => {
		const wrapper = mount(Icon, { props: { rotate: 270 }, slots: { default: 'arrow' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-rotate-270 fa fa-arrow');
	});

	it('flip="horizontal" 添加 icon-flip-horizontal 类', () => {
		const wrapper = mount(Icon, { props: { flip: 'horizontal' }, slots: { default: 'home' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-flip-horizontal fa fa-home');
	});

	it('flip="vertical" 添加 icon-flip-vertical 类', () => {
		const wrapper = mount(Icon, { props: { flip: 'vertical' }, slots: { default: 'home' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-flip-vertical fa fa-home');
	});

	it('spin=true 添加 icon-spin 类', () => {
		const wrapper = mount(Icon, { props: { spin: true }, slots: { default: 'spinner' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-spin fa fa-spinner');
	});

	it('spin="pulse" 添加 icon-pulse 类', () => {
		const wrapper = mount(Icon, { props: { spin: 'pulse' }, slots: { default: 'spinner' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon icon-pulse fa fa-spinner');
	});

	it('组合多个属性时按声明顺序拼接类名', () => {
		const wrapper = mount(Icon, {
			props: { position: 'left', size: '2x', rotate: 90, flip: 'horizontal', spin: true },
			slots: { default: 'home' },
		});
		expect(wrapper.find('i').attributes('class')).toBe(
			'icon icon-left icon-2x icon-rotate-90 icon-flip-horizontal icon-spin fa fa-home',
		);
	});

	it('组合 spin="pulse" 与其他属性', () => {
		const wrapper = mount(Icon, {
			props: { position: 'right', size: '3x', spin: 'pulse' },
			slots: { default: 'loading' },
		});
		expect(wrapper.find('i').attributes('class')).toBe(
			'icon icon-right icon-3x icon-pulse fa fa-loading',
		);
	});

	it('iconSetup 替换默认渲染函数', () => {
		iconSetup({
			renderIcon(iconName, className, arialabel) {
				return <i class={`${className} custom-${iconName}`} data-label={arialabel || iconName} />;
			},
		});
		const wrapper = mount(Icon, { props: { size: '2x' }, slots: { default: 'home' } });
		const i = wrapper.find('i');
		expect(i.classes()).toContain('custom-home');
		expect(i.classes()).toContain('icon-2x');
		expect(i.attributes('data-label')).toBe('home');
		// 自定义渲染不再添加 aria-hidden
		expect(i.attributes('aria-hidden')).toBeUndefined();
	});

	it('iconSetup 自定义渲染接收 aria-label 参数', () => {
		let receivedLabel: string | undefined;
		iconSetup({
			renderIcon(_iconName, _className, arialabel) {
				receivedLabel = arialabel;
				return <i class="custom" />;
			},
		});
		mount(Icon, {
			props: { 'aria-label': '传入标签' },
			slots: { default: 'home' },
		});
		expect(receivedLabel).toBe('传入标签');
	});

	it('iconSetup 未传 renderIcon 时保持原有渲染不变', () => {
		iconSetup({});
		const wrapper = mount(Icon, { slots: { default: 'home' } });
		expect(wrapper.find('i').attributes('class')).toBe('icon fa fa-home');
		expect(wrapper.find('i').attributes('aria-hidden')).toBe('true');
	});
});
