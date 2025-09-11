import { EventEmitter } from '../../stencil-public-runtime';
import { Icon } from '../dga-avatar/dga-avatar';
export type ButtonStyle = 'primary' | 'neutral' | 'secondary-solid' | 'secondary-outline' | 'subtle' | 'transparent';
export type ButtonSize = 'lg' | 'md' | 'sm';
export interface CustomAttribute {
    key: string;
    value: string;
}
export declare class DgaButton {
    variant?: ButtonStyle;
    size?: ButtonSize;
    label?: string;
    iconOnly?: boolean;
    leadIcon?: boolean;
    leadIconProps?: Icon;
    trailIcon?: boolean;
    trailIconProps?: Icon;
    disabled?: boolean;
    btnId?: string;
    type?: 'button' | 'submit' | 'reset';
    onColor?: boolean;
    destructive?: boolean;
    el: HTMLElement;
    onClick?: EventEmitter<MouseEvent>;
    private handleClick;
    componentWillLoad(): void;
    render(): any;
}
