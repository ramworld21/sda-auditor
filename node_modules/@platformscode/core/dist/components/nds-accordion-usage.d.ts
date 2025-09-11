import type { Components, JSX } from "../types/components";

interface NdsAccordionUsage extends Components.NdsAccordionUsage, HTMLElement {}
export const NdsAccordionUsage: {
    prototype: NdsAccordionUsage;
    new (): NdsAccordionUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
