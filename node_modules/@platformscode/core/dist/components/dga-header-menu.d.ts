import type { Components, JSX } from "../types/components";

interface DgaHeaderMenu extends Components.DgaHeaderMenu, HTMLElement {}
export const DgaHeaderMenu: {
    prototype: DgaHeaderMenu;
    new (): DgaHeaderMenu;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
