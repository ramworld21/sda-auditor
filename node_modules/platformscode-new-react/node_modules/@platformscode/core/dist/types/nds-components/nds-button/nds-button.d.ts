import { EventEmitter } from '../../stencil-public-runtime';
import { Icon } from '../../components';
export type ButtonStyle = 'primary-brand' | 'primary-neutral' | 'secondary-solid' | 'secondary-outline' | 'subtle' | 'transparent';
export type ButtonSize = 'lg' | 'md' | 'sm';
export declare class NdsButton {
    el: HTMLElement;
    variant?: ButtonStyle;
    size?: ButtonSize;
    label?: string;
    iconOnly?: boolean;
    leadingIcon?: string;
    leadingIconProps?: Omit<Icon, 'name'>;
    trailingIcon?: string;
    trailingIconProps?: Omit<Icon, 'name'>;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    inverted?: boolean;
    destructive?: boolean;
    selected?: boolean;
    onClick?: EventEmitter<MouseEvent>;
    private handleClick;
    render(): any;
}
