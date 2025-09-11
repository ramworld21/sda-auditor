import type { Components, JSX } from "../types/components";

interface DgaChartUsage extends Components.DgaChartUsage, HTMLElement {}
export const DgaChartUsage: {
    prototype: DgaChartUsage;
    new (): DgaChartUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
