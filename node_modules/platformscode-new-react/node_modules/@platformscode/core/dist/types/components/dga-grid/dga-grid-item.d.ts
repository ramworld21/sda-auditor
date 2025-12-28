export type GridSize = 'auto' | true | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridAlignment = 'flex-start' | 'center' | 'flex-end' | 'stretch';
export declare class DgaGridItem {
    /** Number of columns to span (1-12) */
    xs: GridSize;
    /** Number of columns to span on sm screens */
    sm: GridSize;
    /** Number of columns to span on md screens */
    md: GridSize;
    /** Number of columns to span on lg screens */
    lg: GridSize;
    /** Number of columns to span on xl screens */
    xl: GridSize;
    /** Vertical alignment */
    alignSelf: GridAlignment;
    /** Controls if the item should fill the available space */
    grow: boolean;
    /** Controls if the item should shrink */
    shrink: boolean;
    /** Order of the grid item */
    order: number;
    /** Order on xs screens */
    orderXs: number;
    /** Order on sm screens */
    orderSm: number;
    /** Order on md screens */
    orderMd: number;
    /** Order on lg screens */
    orderLg: number;
    /** Order on xl screens */
    orderXl: number;
    render(): any;
}
