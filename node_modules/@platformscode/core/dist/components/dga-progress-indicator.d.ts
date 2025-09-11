import type { Components, JSX } from "../types/components";

interface DgaProgressIndicator extends Components.DgaProgressIndicator, HTMLElement {}
export const DgaProgressIndicator: {
    prototype: DgaProgressIndicator;
    new (): DgaProgressIndicator;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
