export declare class DgaHeaderAction {
    el: HTMLElement;
    label?: string;
    iconPosition?: 'inline' | 'top';
    icon?: string;
    iconProps: {
        size?: number;
        color?: string;
        variant?: 'stroke' | 'solid' | 'duotone' | 'twotone' | 'bulk';
        type?: 'rounded' | 'sharp' | 'standard';
    };
    active?: boolean;
    onClick: () => void;
    extraClasses?: string;
    openSubMenu: boolean;
    private handleClick;
    componentWillLoad(): void;
    render(): any;
}
