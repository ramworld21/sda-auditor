import { EventEmitter } from '../../stencil-public-runtime';
export declare class DgaRating {
    el: HTMLElement;
    size?: 'sm' | 'md' | 'lg';
    value?: number;
    onChange?: (value: number) => void;
    readOnly?: boolean;
    max?: number;
    variant?: 'default' | 'brand';
    direction?: 'ltr' | 'rtl';
    rating: number;
    hover: number;
    focus: number;
    pressed: number;
    styleText: string;
    ratingChange: EventEmitter<number>;
    private rootRef;
    private handleMouseMove;
    private handleChange;
    private handleClear;
    componentWillLoad(): void;
    watchRating(newRating: number, oldRating: number): void;
    watchValue(newValue: number, oldValue: number): void;
    render(): any;
}
