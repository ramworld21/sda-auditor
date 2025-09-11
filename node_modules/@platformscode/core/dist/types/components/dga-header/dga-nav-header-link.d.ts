import { EventEmitter } from '../../stencil-public-runtime';
export declare class DgaNavHeaderLink {
    el: HTMLElement;
    label: string;
    icon?: string;
    iconProps: {
        size?: number;
        color?: string;
        variant?: 'stroke' | 'solid' | 'duotone' | 'twotone' | 'bulk';
        type?: 'rounded' | 'sharp' | 'standard';
    };
    active: boolean;
    subMenuBackground: 'brand' | 'white';
    subMenuFullWidth: boolean;
    openSubMenu: boolean;
    linkClicked: EventEmitter<void>;
    private handleClick;
    componentWillLoad(): void;
    render(): any;
}
