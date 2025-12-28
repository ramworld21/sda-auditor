import { SxProps } from '../../utils/sx-style-manager';
export declare class DgaFlex {
    el: HTMLElement;
    /** Direction of stack items: 'row' (horizontal) or 'column' (vertical) */
    direction: 'row' | 'column';
    /** Spacing between stack items */
    spacing: number;
    /** Horizontal alignment of stack items */
    align: 'start' | 'center' | 'end' | 'stretch';
    /** Vertical alignment of stack items */
    justify: 'start' | 'center' | 'end' | 'between';
    /** Controls if items should wrap */
    wrap: boolean;
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
