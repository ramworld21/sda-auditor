export declare class DgaTableBody {
    data: {
        selected: boolean;
    }[];
    rowDivider: boolean;
    showSelectCheckBox: boolean;
    alternate: boolean;
    cells: {
        title: string;
        isSort: boolean;
        isFilter: boolean;
        sort?: 'up' | 'down';
        propertyName: string;
        type: 'element' | 'propertyName';
        El?: HTMLElement;
        elProperties?: string[];
        colSpan?: number;
    }[];
    contained: boolean;
    getSelectedRows: any;
    pressOnFilter: any;
    sortedData: any[];
    direction: boolean;
    componentDidLoad(): void;
    componentDidUpdate(): void;
    render(): any;
}
