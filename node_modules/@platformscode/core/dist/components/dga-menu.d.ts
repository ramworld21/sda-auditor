import type { Components, JSX } from "../types/components";

interface DgaMenu extends Components.DgaMenu, HTMLElement {}
export const DgaMenu: {
    prototype: DgaMenu;
    new (): DgaMenu;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
