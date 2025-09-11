import type { Components, JSX } from "../types/components";

interface DgaHeaderSubMenuItem extends Components.DgaHeaderSubMenuItem, HTMLElement {}
export const DgaHeaderSubMenuItem: {
    prototype: DgaHeaderSubMenuItem;
    new (): DgaHeaderSubMenuItem;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
