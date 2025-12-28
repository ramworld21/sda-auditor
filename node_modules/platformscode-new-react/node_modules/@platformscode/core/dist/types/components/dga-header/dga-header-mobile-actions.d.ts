export interface Action {
    label: string;
    icon?: string;
    onClick: () => void;
}
export declare class DgaHeaderMobileActions {
    el: HTMLElement;
    actions?: Action[];
    isMenuOpen: boolean;
    anchorEl: HTMLElement | null;
    toggleMenu: () => void;
    closeMenu: () => void;
    handleOutsideClick: (event: Event) => void;
    render(): any;
}
