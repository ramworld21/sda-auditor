export interface SxProps {
    [key: string]: any;
}
export declare class RadioButton {
    color: 'neutral' | 'brand';
    label?: string;
    hasHelperText?: boolean;
    helperText?: string;
    alertMessage?: boolean;
    alertText?: string;
    disabled: boolean;
    id: string;
    name: string;
    value: string;
    checked?: boolean;
    onChange?: (event: any) => void;
    onInput?: (event: any) => void;
    sx?: SxProps;
    el: HTMLElement;
    radioLabelRef: HTMLLabelElement;
    private customStyleSheet;
    private styleId;
    handleSxChange(): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    private applyCustomStyles;
    processStyles(): void;
    private camelToDash;
    handleActive: () => void;
    handleRemoveActive: () => void;
    handleFocus: () => void;
    handleFocusOut: () => void;
    handleEscape: (event: KeyboardEvent) => void;
    render(): any;
}
