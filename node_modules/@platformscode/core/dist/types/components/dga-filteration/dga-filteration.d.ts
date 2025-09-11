import { EventEmitter } from '../../stencil-public-runtime';
export interface FilterItem {
    id: string;
    label: string;
    value: any;
    count?: number;
}
export interface FilterBlock {
    id: string;
    label: string;
    type: 'checkbox' | 'radio' | 'select' | 'chips' | 'slider' | 'range' | 'date';
    options?: FilterItem[];
    maxHeight?: number;
    collapsed?: boolean;
    min?: number;
    max?: number;
    step?: number;
}
export declare class DgaFilteration {
    initvalue?: {
        [key in FilterBlock['type']]?: {
            blockId: string;
            options: Omit<FilterItem, 'count'>[] | {
                min: number;
                max: number;
            };
        };
    };
    buttonLabel: string;
    filterBlocks: FilterBlock[];
    maxBlockHeight: number;
    isFilterPanelOpen: boolean;
    selectedFilters: {
        blockId: string;
        items: FilterItem[];
    }[];
    expandedBlocks: Set<string>;
    tempFilters: {
        blockId: string;
        items: FilterItem[];
    }[];
    sliderValues: {
        [key: number]: {
            min: number;
            max: string;
        };
    };
    rangeValues: {
        [key: string]: {
            min: string | null;
            max: string | null;
        };
    };
    dateValues: {
        [key: string]: {
            start: Date | null;
            end: Date | null;
        };
    };
    chipsValues: {
        [key: string]: FilterItem[];
    };
    searchQuery: string;
    onFilterChange: EventEmitter<{
        blockId: string;
        items: FilterItem[];
    }[]>;
    private handleInitValue;
    componentWillLoad(): void;
    watchInitValue(): void;
    private toggleFilterPanel;
    private toggleBlockExpansion;
    private handleFilterSelection;
    private handleSliderChange;
    private handleRangeChange;
    private handleDateChange;
    private handleChipsSelection;
    private applyFilters;
    private clearFilters;
    private removeFilter;
    render(): any;
    private renderFilterBlock;
}
