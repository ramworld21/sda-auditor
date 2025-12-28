import type { Components, JSX } from "../types/components";

interface DgaChart extends Components.DgaChart, HTMLElement {}
export const DgaChart: {
    prototype: DgaChart;
    new (): DgaChart;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
