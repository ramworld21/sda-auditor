export declare class DgaHeaderMenuItemUsage {
    isMenuOpen: boolean;
    collapsed: boolean;
    anchorEl: HTMLElement | null;
    get open(): boolean;
    handleClick(event: MouseEvent): void;
    handleClose(): void;
    toggleMenu: () => void;
    closeMenu: () => void;
    render(): any;
}
