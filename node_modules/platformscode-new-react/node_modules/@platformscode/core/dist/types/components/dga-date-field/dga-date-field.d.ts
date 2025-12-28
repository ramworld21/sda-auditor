import { Icon } from '../dga-featured-icon/dga-featured-icon';
export interface DatepickerOptions {
    initialDate?: Date;
    range?: boolean;
    dualMonthView?: boolean;
    inputField?: boolean;
    submitButton?: boolean;
    quickOptions?: boolean;
    value?: Date;
    onSubmit: (event?: any) => void;
    onCancel: (event?: any) => void;
}
export declare class DgaDateField {
    label?: string;
    placeholder?: string;
    size: 'md' | 'lg';
    variant: 'default' | 'lighter' | 'darker';
    error: boolean;
    helperText?: string;
    icon?: Icon;
    disabled: boolean;
    readonly: boolean;
    required: boolean;
    fullwidth: boolean;
    name: string;
    value: string;
    onChange?: (date: Date | null) => void;
    datepickerOptions: DatepickerOptions;
    isActive: boolean;
    isFocused: boolean;
    isDatepickerOpen: boolean;
    errorMessage: string;
    selectedDate: Date | null;
    inputValue: string;
    private inputContainerRef;
    private inputEl;
    valueChanged(newValue: string, oldValue: string): void;
    private handleInput;
    private handleFocus;
    private datepickerRef;
    private handleClickOutside;
    private handleOpenDatepickerPopup;
    private handleDatepickerChange;
    private handleBlur;
    render(): any;
}
