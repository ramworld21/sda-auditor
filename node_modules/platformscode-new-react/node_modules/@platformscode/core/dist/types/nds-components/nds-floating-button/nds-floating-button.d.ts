import { EventEmitter } from '../../stencil-public-runtime';
import { Icon } from '../../components';
export declare class NdsFloatingButton {
    label: string;
    RTL: boolean;
    variant: 'primary-brand' | 'primary-neutral' | 'secondary-solid';
    size: 'sm' | 'lg';
    inverted: boolean;
    disabled: boolean;
    iconOnly: boolean;
    icon: string;
    iconProps?: Omit<Icon, 'name'>;
    buttonClick: EventEmitter<MouseEvent>;
    handleClick(event: MouseEvent): void;
    render(): any;
}
