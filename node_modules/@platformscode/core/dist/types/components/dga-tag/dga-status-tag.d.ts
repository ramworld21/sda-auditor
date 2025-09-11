import { SxProps } from '../../utils/sx-style-manager';
export declare class DgaStatusTag {
    RTL?: boolean;
    label?: string;
    color: 'neutral' | 'green' | 'blue' | 'yellow' | 'red';
    size: 'lg' | 'md' | 'sm';
    status: 'inverted' | 'subtle' | 'ghost';
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
