import type { Components, JSX } from "../types/components";

interface DgaStructuredListUsage extends Components.DgaStructuredListUsage, HTMLElement {}
export const DgaStructuredListUsage: {
    prototype: DgaStructuredListUsage;
    new (): DgaStructuredListUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
