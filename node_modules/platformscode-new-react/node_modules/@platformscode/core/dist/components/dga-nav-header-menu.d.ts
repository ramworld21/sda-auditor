import type { Components, JSX } from "../types/components";

interface DgaNavHeaderMenu extends Components.DgaNavHeaderMenu, HTMLElement {}
export const DgaNavHeaderMenu: {
    prototype: DgaNavHeaderMenu;
    new (): DgaNavHeaderMenu;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
