import { SxProps } from '../../utils/sx-system';
export interface AccordionItem {
    title: string;
    content: string;
    size?: 'lg' | 'md' | 'sm';
    iconAlignment?: 'Leading' | 'Trailing';
    flush?: boolean;
    disabled?: boolean;
    extraClass?: string;
}
export interface IDgaAccordion {
    title: string;
    content: string;
    size: 'lg' | 'md' | 'sm';
    iconAlignment: 'Leading' | 'Trailing';
    flush: boolean;
    disabled: boolean;
    defaultExpanded: boolean;
    extraClass: string;
}
export declare class NdsAccordion {
    el: HTMLElement;
    title: string;
    content: string;
    size: 'lg' | 'md' | 'sm';
    iconAlignment: 'leading' | 'trailing';
    flush: boolean;
    disabled: boolean;
    defaultExpanded: boolean;
    sx?: SxProps | string;
    isOpen: boolean;
    private bodyElement;
    private handleAccordionClick;
    private openAccordion;
    private collapseAccordion;
    componentDidRender(): void;
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
