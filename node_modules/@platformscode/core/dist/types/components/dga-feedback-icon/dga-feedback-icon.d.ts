export type IconType = 'success-check' | 'blue-info' | 'neutral-info' | 'neutral-?' | 'warning-!-circle' | 'warning-!-triangle' | 'error-!' | 'error-x';
export interface FeedbackIcon {
    type: IconType;
    style: 'container' | 'icon-only';
    size: 24 | 16;
}
export type BeakPlacement = 'none' | 'top' | 'bottom' | 'left' | 'right';
export type BeakAlignment = 'start' | 'center' | 'end';
export type Direction = 'top' | 'bottom' | 'left' | 'right';
export type Theme = 'light' | 'dark';
export declare class DgaFeedbackIcon {
    type: IconType;
    variant: 'container' | 'icon-only';
    size: 24 | 16;
    private icons;
    render(): any;
}
