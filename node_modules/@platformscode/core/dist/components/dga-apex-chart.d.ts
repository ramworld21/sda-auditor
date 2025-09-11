import type { Components, JSX } from "../types/components";

interface DgaApexChart extends Components.DgaApexChart, HTMLElement {}
export const DgaApexChart: {
    prototype: DgaApexChart;
    new (): DgaApexChart;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
