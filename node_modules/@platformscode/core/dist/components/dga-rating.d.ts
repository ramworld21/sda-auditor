import type { Components, JSX } from "../types/components";

interface DgaRating extends Components.DgaRating, HTMLElement {}
export const DgaRating: {
    prototype: DgaRating;
    new (): DgaRating;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
