import type { Components, JSX } from "../types/components";

interface DgaCardTitle extends Components.DgaCardTitle, HTMLElement {}
export const DgaCardTitle: {
    prototype: DgaCardTitle;
    new (): DgaCardTitle;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
