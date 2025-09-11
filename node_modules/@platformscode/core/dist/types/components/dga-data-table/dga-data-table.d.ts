import { FunctionalComponent } from '../../stencil-public-runtime';
export interface CellConfig {
    title: string;
    isSort: boolean;
    isFilter: boolean;
    sort?: 'up' | 'down';
    propertyName: string;
    type: 'element' | 'propertyName';
    El?: string | FunctionalComponent<any>;
    elProperties?: string[];
    staticProps?: {
        [key: string]: any;
    };
    propMapping?: {
        [componentProp: string]: string;
    };
    colSpan?: number;
}
export interface IColumnCheckboxType {
    type: 'checkbox';
}
export interface IColumnRoot {
    label?: string;
    field: string;
    sortable?: boolean;
    filterable?: boolean;
}
export interface IColumn {
    label: string;
    sortable?: boolean;
}
export declare class DgaDataTable {
    columns: IColumn[];
    data: any;
    rowDivider: boolean;
    showSelectCheckBox: boolean;
    alternate: boolean;
    cells: CellConfig[];
    contained: boolean;
    getSelectedRows: any;
    pressOnFilter: any;
    sortedData: any[];
    direction: boolean;
    private initializeData;
    private sortData;
    private handleSelectedRowChanges;
    private selectAll;
    private buildComponentProps;
    componentWillLoad(): void;
    render(): any;
}
