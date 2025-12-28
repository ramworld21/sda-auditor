export declare class DgaCarousel {
    private DIRECTION;
    private slidesContainer?;
    el: HTMLElement;
    variant: 'arrows' | 'dots' | 'dots-only';
    showDots: boolean;
    steps: number;
    transitionDuration: number;
    Dir: 'rtl' | 'ltr';
    size: 'sm' | 'md' | 'lg';
    arrowsVariant: 'primary' | 'subtle';
    arrows: {
        variant: 'primary' | 'subtle';
        size: 'sm' | 'md' | 'lg';
    };
    childWidth: number;
    childrenLength: number;
    currentSlideIndex: number;
    private isRTL;
    changeSlide(direction: any): void;
    updateSlidePosition(): void;
    showLeftArrow(): boolean;
    showRightArrow(): boolean;
    isHighlighted(index: number): boolean;
    componentDidLoad(): void;
    calculateChildWidth(): void;
    updateChildrenLength(): void;
    render(): any;
}
