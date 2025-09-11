export type GridSpacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type FlexibleGap = string | number | ResponsiveGap;
export interface ResponsiveGap {
    xs?: string | number;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
}
export declare class DgaGridContainer {
    el: HTMLElement;
    /** Set to true to use the full width of the viewport */
    fluid: boolean;
    /** Gap between grid items (can be a string like "12px" or a responsive object) */
    gap: FlexibleGap;
    /** Column gap between grid items (can be a string like "12px" or a responsive object) */
    columnGap: FlexibleGap;
    /** Row gap between grid items (can be a string like "12px" or a responsive object) */
    rowGap: FlexibleGap;
    /** Spacing between grid items (legacy prop using 8px multiplier) */
    spacing: GridSpacing;
    /** Set to true to disable gutters */
    disableGutters: boolean;
    updateSpacing(): void;
    componentDidLoad(): void;
    private parseGapValue;
    private applyGapStyles;
    render(): any;
}
