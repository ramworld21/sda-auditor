import { SxProps } from '../../utils/sx-style-manager';
export type LoadingSize = 'tiny' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'huge';
export type LoadingStyle = 'neutral' | 'brand' | 'on-color';
export declare class DgaLoading {
    size: LoadingSize;
    variant: LoadingStyle;
    extraClass?: string;
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
