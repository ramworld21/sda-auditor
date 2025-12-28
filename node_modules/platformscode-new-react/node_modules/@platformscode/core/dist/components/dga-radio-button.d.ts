import type { Components, JSX } from "../types/components";

interface DgaRadioButton extends Components.DgaRadioButton, HTMLElement {}
export const DgaRadioButton: {
    prototype: DgaRadioButton;
    new (): DgaRadioButton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
