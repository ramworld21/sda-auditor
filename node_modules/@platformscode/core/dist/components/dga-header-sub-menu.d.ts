import type { Components, JSX } from "../types/components";

interface DgaHeaderSubMenu extends Components.DgaHeaderSubMenu, HTMLElement {}
export const DgaHeaderSubMenu: {
    prototype: DgaHeaderSubMenu;
    new (): DgaHeaderSubMenu;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
