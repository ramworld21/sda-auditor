import type { Components, JSX } from "../types/components";

interface DgaProgressIndicatorStep extends Components.DgaProgressIndicatorStep, HTMLElement {}
export const DgaProgressIndicatorStep: {
    prototype: DgaProgressIndicatorStep;
    new (): DgaProgressIndicatorStep;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
