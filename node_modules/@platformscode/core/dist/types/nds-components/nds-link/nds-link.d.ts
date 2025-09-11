import { EventEmitter } from '../../stencil-public-runtime';
export declare class NdsLink {
    variant: 'primary' | 'neutral' | 'on-color';
    size: 'sm' | 'md';
    label: string;
    href: string;
    inline?: boolean;
    icon?: string;
    iconProps?: Omit<HTMLDgaIconElement, 'name'>;
    disabled?: boolean;
    target?: '_blank' | '_self' | '_parent' | '_top';
    onClick?: EventEmitter<MouseEvent>;
    private handleClick;
    render(): any;
}
