export declare class MonthNavigator {
    RTL: boolean;
    currentMonth: Date;
    showArrows: boolean;
    onChange: (newMonth: Date) => void;
    isYearsDropdownOpen: boolean;
    private get yearsList();
    private handleYearSelect;
    private toggleYearsDropdown;
    el: HTMLElement;
    private yearDropdownRef;
    private scrollToSelectedYear;
    handlePrevClick: () => void;
    handleNextClick: () => void;
    render(): any;
}
