import { EventEmitter } from '../../stencil-public-runtime';
import { Icon } from '../dga-avatar/dga-avatar';
export interface Option {
    label: string;
    value: string;
}
export declare class DgaPrefix {
    type: string;
    variant: 'solid' | 'subtle';
    options?: Option[];
    label: string;
    icon?: Icon;
    dpIsActive: boolean;
    selectedOption: Option | null;
    private prefixBtn;
    onSelect: EventEmitter<string>;
    handlePrefixClick(): void;
    handleOptionSelect(option: Option): void;
    render(): any;
}
