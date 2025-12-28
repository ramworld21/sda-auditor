import { SxProps } from '../../utils/sx-system';
import { Icon } from '../../components';
export declare class NdsChip {
    el: HTMLElement;
    label?: string;
    variant: 'success' | 'neutral' | 'on-color';
    size: 'lg' | 'md' | 'sm';
    leadingIcon?: string;
    leadingIconProps?: Omit<Icon, 'name'>;
    trailingIcon?: string;
    trailingIconProps?: Omit<Icon, 'name'>;
    rounded?: boolean;
    disabled?: boolean;
    selected?: boolean;
    onChange?: (selected: boolean) => void;
    sx?: SxProps | string;
    pressed: boolean;
    isSelectedState: boolean;
    private componentId;
    private sxStyleManager;
    private rootStyles;
    handleSxChange(): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUpdate(): void;
    processStyling(): void;
    disconnectedCallback(): void;
    render(): any;
}
