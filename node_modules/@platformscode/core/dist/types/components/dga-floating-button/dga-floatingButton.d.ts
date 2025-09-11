import { EventEmitter } from '../../stencil-public-runtime';
export declare class FloatingButton {
    label: string;
    RTL: boolean;
    variant: 'primary-brand' | 'primary-neutral' | 'secondary-solid';
    size: 'small' | 'large';
    icon: string;
    onColor: boolean;
    disabled: boolean;
    iconOnly: boolean;
    iconProps?: {
        [key: string]: any;
    };
    buttonClick: EventEmitter<MouseEvent>;
    handleClick(event: MouseEvent): void;
    private renderIcon;
    render(): any;
}
