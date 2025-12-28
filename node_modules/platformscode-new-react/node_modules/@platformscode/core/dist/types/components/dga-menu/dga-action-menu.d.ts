export declare class DgaActionMenu {
    open: boolean;
    onClose: () => void;
    placement: 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top';
    el: HTMLElement;
    private handleOutsideClick;
    private watchOpenChange;
    componentWillLoad(): void;
    componentWillUpdate(): void;
    disconnectedCallback(): void;
    private getPlacementStyle;
    render(): any;
}
