import { EventEmitter } from '../../stencil-public-runtime';
import { SxProps } from '../../utils/sx-system';
export interface IBreadcrumbsItem {
    label: string;
    path: string;
    disabled?: boolean;
    [type: string]: any;
}
export interface IEllipsisItem {
    ellipsis: true;
    items: IBreadcrumbsItem[];
}
export declare class DgaBreadcrumbs {
    el: HTMLElement;
    items: IBreadcrumbsItem[];
    max: number;
    sx?: SxProps | string;
    breadcrumbClick: EventEmitter<any>;
    private breadcrumbItems;
    isMenuOpen: boolean;
    toggleMenu: () => void;
    closeMenu: () => void;
    handleOutsideClick: (event: Event) => void;
    componentWillLoad(): void;
    disconnectedCallback(): void;
    handleItemsChange(newValue: IBreadcrumbsItem[]): void;
    private isEllipsisItem;
    private renderItems;
    private handleClick;
    private componentId;
    private sxStyleManager;
    private rootStyles;
    handleSxChange(): void;
    componentDidLoad(): void;
    componentDidUpdate(): void;
    processStyling(): void;
    private getArrowIcon;
    render(): any;
}
