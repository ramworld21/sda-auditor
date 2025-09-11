import type { Components, JSX } from "../types/components";

interface DgaHeaderMenuItem extends Components.DgaHeaderMenuItem, HTMLElement {}
export const DgaHeaderMenuItem: {
    prototype: DgaHeaderMenuItem;
    new (): DgaHeaderMenuItem;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
