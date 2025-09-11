import { SxProps } from '../../utils/sx-system';
export type AvatarType = 'initials' | 'image' | 'icon';
export type AvatarSize = 120 | 80 | 68 | 48 | 40 | 32 | 24;
export interface Icon {
    name: string;
    size?: number;
    color?: string;
    variant?: 'stroke' | 'solid' | 'duotone' | 'twotone' | 'bulk';
    type?: 'rounded' | 'sharp' | 'standard';
}
export interface RootAvatar {
}
export interface IDgaAvatar {
    type?: AvatarType;
    size?: AvatarSize;
    square?: boolean;
    border?: boolean;
    text?: string;
    imgUrl?: string;
    alt?: string;
    icon?: Icon;
}
export declare class DgaAvatar {
    el: HTMLElement;
    type?: AvatarType;
    size?: AvatarSize;
    square?: boolean;
    border?: boolean;
    text?: string;
    imgUrl?: string;
    alt?: string;
    icon?: Icon;
    sx?: SxProps | string;
    private renderChildComponent;
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
