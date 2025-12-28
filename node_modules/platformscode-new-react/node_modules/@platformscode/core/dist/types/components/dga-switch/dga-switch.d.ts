import { SxProps } from '../../utils/sx-handler';
export interface SwitchProps {
    color?: string;
    label?: string;
    checked?: boolean;
    hasHelperText?: boolean;
    helperText?: string;
    alertMessage?: boolean;
    alertText?: string;
    disabled?: boolean;
    id?: string;
    name?: string;
    value?: boolean | any;
    onChange?: (event?: any) => void;
    onInput?: (event?: any) => void;
}
export declare class DgaSwitch {
    el: HTMLElement;
    sx?: SxProps | string | undefined;
    color: string;
    label?: string;
    checked: boolean;
    hasHelperText?: boolean;
    helperText?: string;
    alertMessage?: boolean;
    alertText?: string;
    disabled: boolean;
    id: string;
    name: string;
    value: boolean | any;
    onChange?: (event?: any) => void;
    onInput?: (event?: any) => void;
    isChecked: boolean;
    labelRef: HTMLLabelElement;
    private sxHandler;
    private generateGuid;
    private handleActive;
    private handleRemoveActive;
    private handleFocus;
    private handleFocusOut;
    private handleEscape;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    sxChanged(): void;
    componentWillLoad(): void;
    render(): any;
}
