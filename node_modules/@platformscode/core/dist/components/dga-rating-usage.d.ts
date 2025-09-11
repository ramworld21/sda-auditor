import type { Components, JSX } from "../types/components";

interface DgaRatingUsage extends Components.DgaRatingUsage, HTMLElement {}
export const DgaRatingUsage: {
    prototype: DgaRatingUsage;
    new (): DgaRatingUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
