import { Icon } from '../dga-avatar/dga-avatar';
import { SxProps } from '../../utils/sx-style-manager';
export declare class DgaTag {
    label?: string;
    variant: 'neutral' | 'success' | 'info' | 'warning' | 'error' | 'on-color';
    size: 'lg' | 'md' | 'sm';
    iconOnly?: boolean;
    leadIcon?: Icon;
    trailIcon?: Icon;
    rounded?: boolean;
    outlined?: boolean;
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
