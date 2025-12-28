import type { Components, JSX } from "../types/components";

interface DgaMetricChart extends Components.DgaMetricChart, HTMLElement {}
export const DgaMetricChart: {
    prototype: DgaMetricChart;
    new (): DgaMetricChart;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
