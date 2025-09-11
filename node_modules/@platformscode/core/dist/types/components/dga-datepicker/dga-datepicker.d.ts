import { EventEmitter } from '../../stencil-public-runtime';
export declare class DgaDatepicker {
    RTL?: boolean;
    initialDate?: Date;
    range?: boolean;
    dualMonthView?: boolean;
    inputField?: boolean;
    submitButton?: boolean;
    qickOptions?: boolean;
    value?: Date;
    onSubmit: (event?: any) => void;
    onCancel: (event?: any) => void;
    currentMonth: Date;
    selectedDate: Date | null;
    rangeDates: {
        startDate?: Date;
        endDate?: Date | null;
    };
    inputDates: {
        startDate?: string;
        endDate?: string;
    };
    change: EventEmitter<Date>;
    watchSelectedDate(newDate: Date, oldDate: Date): void;
    watchValue(newValue: Date, oldValue: Date): void;
    private get nextMonth();
    private get days();
    private get nextMonthDays();
    private formatDate;
    private handleSelectDate;
    private handleInputDate;
    private handleChangeMonth;
    private isMidRange;
    private isFirstRangeChild;
    private isLastRangeChild;
    componentDidLoad(): void;
    handlePrevClick: () => void;
    handleNextClick: () => void;
    render(): any;
}
