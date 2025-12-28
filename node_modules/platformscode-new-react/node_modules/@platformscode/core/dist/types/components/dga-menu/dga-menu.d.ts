export declare class DgaMenu {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    private handleClickOutside;
    private getMenuStyle;
    render(): any;
}
