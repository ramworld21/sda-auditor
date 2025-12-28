export interface Icon {
    name: string;
    size?: number;
    color?: string;
    variant?: 'stroke' | 'solid' | 'duotone' | 'twotone' | 'bulk';
    type?: 'rounded' | 'sharp' | 'standard';
}
export declare class DgaFeaturedIcon {
    size: 'sm' | 'md' | 'lg' | 'xl';
    color: 'brand' | 'gray' | 'error' | 'warning' | 'success' | 'info';
    variant: 'light' | 'dark' | 'outlined';
    circle?: boolean;
    icon: Icon;
    iconFonts: {
        xl: number;
        lg: number;
        md: number;
        sm: number;
    };
    render(): any;
}
