import { SxProps } from '../../utils/sx-handler';
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
export declare class DgaTooltip {
    el: HTMLElement;
    sx?: SxProps | string | undefined;
    beakPlacement: BeakPlacement;
    beakAlignment: BeakAlignment;
    direction: Direction;
    tooltipTitle?: string;
    helperText?: string;
    icon: boolean;
    feedbackIcon: FeedbackIcon;
    theme: Theme;
    isHovered: boolean;
    private sxHandler;
    private icons;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    sxChanged(): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    render(): any;
}
