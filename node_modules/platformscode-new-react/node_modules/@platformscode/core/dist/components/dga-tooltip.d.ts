import type { Components, JSX } from "../types/components";

interface DgaTooltip extends Components.DgaTooltip, HTMLElement {}
export const DgaTooltip: {
    prototype: DgaTooltip;
    new (): DgaTooltip;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
