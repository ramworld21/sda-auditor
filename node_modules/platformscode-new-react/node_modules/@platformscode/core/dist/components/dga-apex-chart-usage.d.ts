import type { Components, JSX } from "../types/components";

interface DgaApexChartUsage extends Components.DgaApexChartUsage, HTMLElement {}
export const DgaApexChartUsage: {
    prototype: DgaApexChartUsage;
    new (): DgaApexChartUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
