import { Icon } from '../dga-featured-icon/dga-featured-icon';
export declare class DgaCardImage {
    type?: 'default' | 'expanded' | 'selectable';
    showTitle?: boolean;
    showDescription?: boolean;
    showFeaturedIcon?: boolean;
    src: string;
    alt: string;
    featuredIcon?: Icon;
    showPrimaryAction?: boolean;
    primaryActionLabel?: string;
    showSecondaryAction?: boolean;
    isSelected?: boolean;
    secondaryActionLabel?: string;
    onCheckboxChange?: () => void;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    onExpandAction?: () => void;
    isFocused: boolean;
    expanded: boolean;
    el: HTMLElement;
    toggleExpand(): void;
    componentWillLoad(): void;
    render(): any;
}
