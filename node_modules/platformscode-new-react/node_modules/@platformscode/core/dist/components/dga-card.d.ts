import type { Components, JSX } from "../types/components";

interface DgaCard extends Components.DgaCard, HTMLElement {}
export const DgaCard: {
    prototype: DgaCard;
    new (): DgaCard;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
