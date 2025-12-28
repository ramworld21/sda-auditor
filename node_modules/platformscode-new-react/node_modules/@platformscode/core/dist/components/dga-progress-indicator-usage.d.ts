import type { Components, JSX } from "../types/components";

interface DgaProgressIndicatorUsage extends Components.DgaProgressIndicatorUsage, HTMLElement {}
export const DgaProgressIndicatorUsage: {
    prototype: DgaProgressIndicatorUsage;
    new (): DgaProgressIndicatorUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
