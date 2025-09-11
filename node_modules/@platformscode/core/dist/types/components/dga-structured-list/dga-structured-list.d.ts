export declare class DgaStructuredList {
    data: any[];
    rowDivider: boolean;
    colDivider: boolean;
    compact: boolean;
    selectable: boolean;
    alternate: boolean;
    cells: Array<{
        title: string;
        propertyName: string;
        type: 'element' | 'propertyName';
        El?: any;
        elProperties?: string[];
        colSpan?: number;
        customAttribute?: {
            key: string;
            value: string;
        };
        sort?: 'up' | 'down' | 'none';
        isSort?: boolean;
        isFilter?: boolean;
    }>;
    contained: boolean;
    getSelectedRows?: (event?: any) => void;
    sortedData: any[];
    direction: boolean;
    handleDataChange(): void;
    initializeDirection(): void;
    initializeSortedData(): void;
    handleSelectedRowChanges(checked: boolean, rowIndex: number, propertyName: string, cellIndex: number): void;
    sx?: SxProps;
    el: HTMLElement;
    private componentId;
    private sxStyleManager;
    private rootStyles;
    handleSxChange(): void;
    processStyling(): void;
    disconnectedCallback(): void;
    render(): any;
}
