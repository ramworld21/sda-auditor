import { FilterBlock, FilterItem } from '../components';
export declare class DgaFilterationUsage {
    filterBlocks: FilterBlock[];
    private handleFilterChange;
    initialValue: {
        [key in FilterBlock["type"]]?: {
            blockId: string;
            options: Omit<FilterItem, "count">[] | {
                min: number;
                max: number;
            };
        };
    };
    render(): any;
}
