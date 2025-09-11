import type { Components, JSX } from "../types/components";

interface DgaMetricUsage extends Components.DgaMetricUsage, HTMLElement {}
export const DgaMetricUsage: {
    prototype: DgaMetricUsage;
    new (): DgaMetricUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
