import { SxProps } from '../../utils/sx-handler';
export interface TabType {
    Name: string;
    Target: string;
    Children?: TabType[];
}
export declare class NdsTableOfContent {
    el: HTMLElement;
    sections: TabType[];
    subTitle: string;
    tocTitle: string;
    defaultActiveId?: string;
    rtl: boolean;
    sx?: SxProps | string | undefined;
    activeSectionId: string;
    private tabRefs;
    private isManuallyScrolling;
    private scrollTimeout;
    private sxHandler;
    sxChanged(): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    private convertToScrollRanges;
    private handleScroll;
    private moveTOSelectedId;
    private handleAddPressed;
    private handleRemovePressed;
    private renderTab;
    private renderSubTabs;
    render(): any;
}
