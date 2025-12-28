import type { Components, JSX } from "../types/components";

interface DgaModalTitle extends Components.DgaModalTitle, HTMLElement {}
export const DgaModalTitle: {
    prototype: DgaModalTitle;
    new (): DgaModalTitle;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
