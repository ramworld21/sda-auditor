import { SxProps } from '../../utils/sx-handler';
export declare class DgaSlider {
    min: number;
    max: number;
    step: number;
    range: boolean;
    label: string;
    showLabel: boolean;
    showHelperText: boolean;
    helperText: string;
    size: 'small' | 'medium';
    initialMin: number;
    initialMax: number;
    onChange?: (props: {
        min: number;
        max: number;
    }) => void;
    sx?: SxProps | string | undefined;
    el: HTMLElement;
    minValue: number;
    maxValue: number;
    minPos: number;
    maxPos: number;
    railColorStyle: {
        left: string;
        width: string;
    };
    calculatePositions(): void;
    componentWillLoad(): void;
    watchMinValue(newValue: any): void;
    watchMaxValue(newValue: any): void;
    watchRangeValue(): void;
    watchInitialMin(): void;
    watchInitialMax(): void;
    handleMinChange(e: Event): void;
    handleMaxChange(e: Event): void;
    private sxHandler;
    componentDidLoad(): void;
    sxChanged(): void;
    disconnectedCallback(): void;
    render(): any;
}
