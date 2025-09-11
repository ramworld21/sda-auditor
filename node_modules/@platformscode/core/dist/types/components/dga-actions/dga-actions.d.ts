export declare class DgaActions {
    /** Direction of stack items: 'row' (horizontal) or 'column' (vertical) */
    direction: 'row' | 'column';
    /** Spacing between stack items */
    gap: string;
    /** Horizontal alignment of stack items */
    align: 'start' | 'center' | 'end' | 'stretch';
    /** Vertical alignment of stack items */
    justify: 'start' | 'center' | 'end' | 'between';
    /** Controls if items should wrap */
    wrap: boolean;
    render(): any;
}
