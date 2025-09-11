import { SxProps } from '../../utils/sx-style-manager';
export declare class DgaNotification {
    icon?: boolean;
    leadText: string;
    content: string;
    variant: 'critical' | 'warning' | 'success' | 'info' | 'neutral';
    link?: boolean;
    textLink?: string;
    dismissable?: boolean;
    setNavigateTo?: string;
    navigateTo?: (link?: string) => void;
    dismmissed?: () => void;
    private icons;
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
