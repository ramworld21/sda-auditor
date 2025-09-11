import { EventEmitter } from '../../stencil-public-runtime';
export interface Option {
    label: string;
    value: string;
}
export declare class DgaSuffix {
    type: string;
    variant: string;
    options?: Option[];
    label: string;
    icon?: any;
    dpIsActive: boolean;
    selectedOption: Option | null;
    private suffixBtn;
    onSelect: EventEmitter<string>;
    handleSuffixClick(): void;
    handleOptionSelect(option: Option): void;
    render(): any;
}
