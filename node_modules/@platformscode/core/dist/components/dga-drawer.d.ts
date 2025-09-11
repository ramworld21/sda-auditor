import type { Components, JSX } from "../types/components";

interface DgaDrawer extends Components.DgaDrawer, HTMLElement {}
export const DgaDrawer: {
    prototype: DgaDrawer;
    new (): DgaDrawer;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
