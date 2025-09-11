export declare class DgaMenuUsage {
    anchorEl: HTMLElement | null;
    get open(): boolean;
    handleClick(event: MouseEvent): void;
    handleClose(): void;
    isMenuOpen: boolean;
    private buttonRef;
    toggleMenu: () => void;
    closeMenu: () => void;
    render(): any;
}
