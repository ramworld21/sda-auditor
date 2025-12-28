import type { Components, JSX } from "../types/components";

interface DgaSlider extends Components.DgaSlider, HTMLElement {}
export const DgaSlider: {
    prototype: DgaSlider;
    new (): DgaSlider;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
