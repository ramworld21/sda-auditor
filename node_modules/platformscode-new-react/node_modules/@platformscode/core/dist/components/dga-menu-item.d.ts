import type { Components, JSX } from "../types/components";

interface DgaMenuItem extends Components.DgaMenuItem, HTMLElement {}
export const DgaMenuItem: {
    prototype: DgaMenuItem;
    new (): DgaMenuItem;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
