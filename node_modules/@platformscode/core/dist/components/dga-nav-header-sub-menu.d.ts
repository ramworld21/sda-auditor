import type { Components, JSX } from "../types/components";

interface DgaNavHeaderSubMenu extends Components.DgaNavHeaderSubMenu, HTMLElement {}
export const DgaNavHeaderSubMenu: {
    prototype: DgaNavHeaderSubMenu;
    new (): DgaNavHeaderSubMenu;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
