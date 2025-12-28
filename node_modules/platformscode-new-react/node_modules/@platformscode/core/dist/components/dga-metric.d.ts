import type { Components, JSX } from "../types/components";

interface DgaMetric extends Components.DgaMetric, HTMLElement {}
export const DgaMetric: {
    prototype: DgaMetric;
    new (): DgaMetric;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
