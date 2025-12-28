import type { Components, JSX } from "../types/components";

interface DgaHeaderMenuItemUsage extends Components.DgaHeaderMenuItemUsage, HTMLElement {}
export const DgaHeaderMenuItemUsage: {
    prototype: DgaHeaderMenuItemUsage;
    new (): DgaHeaderMenuItemUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
