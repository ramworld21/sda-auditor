import { SxProps } from '../../utils/sx-system';
export interface ITab {
    label: string;
    link?: string;
    tabIcon?: string;
    iconProps?: {
        [key: string]: any;
    };
    onClick?: (e: MouseEvent) => void;
}
export interface ITabsComponentProps {
    size: string;
    orientation: 'horizontal' | 'vertical';
    external: boolean;
    tabIcons?: boolean;
    flush?: boolean;
    divider?: boolean;
    tabsList: ITab[];
    extraClass?: string;
    disabled?: boolean;
}
export declare class DgaTabs {
    el: HTMLElement;
    size: 'sm' | 'md' | 'lg';
    orientation: 'horizontal' | 'vertical';
    external: boolean;
    flush: boolean;
    divider: boolean;
    tabsList: ITab[];
    extraClass?: string;
    disabled: boolean;
    activeTab: number | null;
    isMenuOpen: boolean;
    private setActiveTab;
    toggleMenu: () => void;
    closeMenu: () => void;
    handleOutsideClick: (event: Event) => void;
    private renderIcon;
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
