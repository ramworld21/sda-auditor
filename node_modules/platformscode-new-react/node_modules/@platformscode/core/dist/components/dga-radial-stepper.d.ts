import type { Components, JSX } from "../types/components";

interface DgaRadialStepper extends Components.DgaRadialStepper, HTMLElement {}
export const DgaRadialStepper: {
    prototype: DgaRadialStepper;
    new (): DgaRadialStepper;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
