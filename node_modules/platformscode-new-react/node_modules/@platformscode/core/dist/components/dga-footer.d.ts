import type { Components, JSX } from "../types/components";

interface DgaFooter extends Components.DgaFooter, HTMLElement {}
export const DgaFooter: {
    prototype: DgaFooter;
    new (): DgaFooter;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
