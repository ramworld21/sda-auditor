import { EventEmitter } from '../../stencil-public-runtime';
import { SxProps } from '../../utils/sx-style-manager';
export type ButtonStyle = 'primary-neutral' | 'primary-brand' | 'secondary' | 'secondary-outline' | 'subtle' | 'transparent' | 'des-primary' | 'des-secondary' | 'des-secondary-outline' | 'des-subtle' | 'des-transparent';
export type ButtonSize = 'lg' | 'md' | 'sm';
export interface CustomAttribute {
    key: string;
    value: string;
}
export declare class DgaButton {
    el: HTMLElement;
    variant?: ButtonStyle;
    size?: ButtonSize;
    label?: string;
    iconOnly?: boolean;
    iconType?: string;
    iconProps?: {
        [key: string]: any;
    };
    leadIcon?: boolean;
    leadIconType?: string;
    leadIconProps?: {
        [key: string]: any;
    };
    trailIcon?: boolean;
    trailIconType?: string;
    trailIconProps?: {
        [key: string]: any;
    };
    disabled?: boolean;
    btnId?: string;
    type?: 'button' | 'submit' | 'reset';
    onColor?: boolean;
    sx?: SxProps | string;
    onClick?: EventEmitter<MouseEvent>;
    private handleClick;
    private renderIcon;
    private componentId;
    private sxStyleManager;
    private rootStyles;
    handleSxChange(): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUpdate(): void;
    processStyling(): void;
    disconnectedCallback(): void;
    render(): any;
}
