import type { Components, JSX } from "../types/components";

interface DgaRadioButtonUsage extends Components.DgaRadioButtonUsage, HTMLElement {}
export const DgaRadioButtonUsage: {
    prototype: DgaRadioButtonUsage;
    new (): DgaRadioButtonUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
