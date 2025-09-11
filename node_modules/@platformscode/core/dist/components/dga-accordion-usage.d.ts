import type { Components, JSX } from "../types/components";

interface DgaAccordionUsage extends Components.DgaAccordionUsage, HTMLElement {}
export const DgaAccordionUsage: {
    prototype: DgaAccordionUsage;
    new (): DgaAccordionUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
