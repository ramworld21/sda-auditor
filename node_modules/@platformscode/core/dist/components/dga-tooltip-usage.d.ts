import type { Components, JSX } from "../types/components";

interface DgaTooltipUsage extends Components.DgaTooltipUsage, HTMLElement {}
export const DgaTooltipUsage: {
    prototype: DgaTooltipUsage;
    new (): DgaTooltipUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
