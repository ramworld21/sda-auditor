import { SxProps } from '../../utils/sx-system';
export declare class DgaChip {
    label?: string;
    variant: 'success' | 'neutral' | 'on-color';
    size: 'lg' | 'md' | 'sm';
    leadIcon?: any;
    leadIconProps?: {
        [key: string]: any;
    };
    trailIcon?: any;
    trailIconProps?: {
        [key: string]: any;
    };
    rounded?: boolean;
    disabled?: boolean;
    isSelected?: boolean;
    onChange?: (isSelected: boolean) => void;
    pressed: boolean;
    isSelectedState: boolean;
    private renderIcon;
    el: HTMLElement;
    sx?: SxProps | string;
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
