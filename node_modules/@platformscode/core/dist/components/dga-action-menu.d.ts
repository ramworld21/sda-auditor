import type { Components, JSX } from "../types/components";

interface DgaActionMenu extends Components.DgaActionMenu, HTMLElement {}
export const DgaActionMenu: {
    prototype: DgaActionMenu;
    new (): DgaActionMenu;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
