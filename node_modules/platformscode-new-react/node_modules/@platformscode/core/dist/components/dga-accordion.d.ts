import type { Components, JSX } from "../types/components";

interface DgaAccordion extends Components.DgaAccordion, HTMLElement {}
export const DgaAccordion: {
    prototype: DgaAccordion;
    new (): DgaAccordion;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
