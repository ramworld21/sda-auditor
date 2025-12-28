import type { Components, JSX } from "../types/components";

interface DgaSliderUsage extends Components.DgaSliderUsage, HTMLElement {}
export const DgaSliderUsage: {
    prototype: DgaSliderUsage;
    new (): DgaSliderUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
