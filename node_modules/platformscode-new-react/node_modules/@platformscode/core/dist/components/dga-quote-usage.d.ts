import type { Components, JSX } from "../types/components";

interface DgaQuoteUsage extends Components.DgaQuoteUsage, HTMLElement {}
export const DgaQuoteUsage: {
    prototype: DgaQuoteUsage;
    new (): DgaQuoteUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
