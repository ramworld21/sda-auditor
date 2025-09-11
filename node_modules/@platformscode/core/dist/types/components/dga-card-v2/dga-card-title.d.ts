import { Icon } from '../dga-featured-icon/dga-featured-icon';
export declare class DgaCardTitle {
    type?: 'default' | 'expanded' | 'selectable';
    showTitle?: boolean;
    showDescription?: boolean;
    showFeaturedIcon?: boolean;
    image?: string;
    showRating?: boolean;
    disabled?: boolean;
    effect?: 'with-shadow' | 'no-shadow' | 'stroke';
    cardTitle?: string;
    description?: string;
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
