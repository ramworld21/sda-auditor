export declare class DateCell {
    date: Date;
    isCurrentMonth: boolean;
    isSelected: boolean;
    isToday: boolean;
    midRange?: boolean;
    isFirstRangeChild: boolean;
    isLastRangeChild: boolean;
    onSelect: (date: Date) => void;
    private handleClick;
    private handleAddPressed;
    private handleRemovePressed;
    render(): any;
}
