import type { Components, JSX } from "../types/components";

interface DgaQuote extends Components.DgaQuote, HTMLElement {}
export const DgaQuote: {
    prototype: DgaQuote;
    new (): DgaQuote;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
