import { SxProps } from '../../utils/sx-style-manager';
export declare class DgaCardV2 {
    el: HTMLElement;
    type?: 'default' | 'expanded' | 'selectable';
    disabled?: boolean;
    effect?: 'with-shadow' | 'no-shadow' | 'stroke';
    isSelected?: boolean;
    onCheckboxChange?: () => void;
    sx?: SxProps | string;
    width?: string;
    maxWidth?: string;
    minWidth?: string;
    isFocused: boolean;
    private componentId;
    private sxStyleManager;
    private rootStyles;
    private onMouseEnterHandler;
    private onMouseLeaveHandler;
    handleSxChange(): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUpdate(): void;
    processStyling(): void;
    disconnectedCallback(): void;
    private cardStyles;
    render(): any;
}
