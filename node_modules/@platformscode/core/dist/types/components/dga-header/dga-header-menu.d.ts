export interface Action {
    label: string;
    icon?: string;
    onClick: () => void;
}
export declare class DgaHeaderMenu {
    el: HTMLElement;
    actions?: Action[];
    icon?: string;
    isMenuOpen: boolean;
    toggleMenu: () => void;
    closeMenu: () => void;
    handleOutsideClick: (event: Event) => void;
    render(): any;
}
