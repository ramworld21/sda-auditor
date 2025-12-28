import type { Components, JSX } from "../types/components";

interface DgaButton extends Components.DgaButton, HTMLElement {}
export const DgaButton: {
    prototype: DgaButton;
    new (): DgaButton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
