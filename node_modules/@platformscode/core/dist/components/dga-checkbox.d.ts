import type { Components, JSX } from "../types/components";

interface DgaCheckbox extends Components.DgaCheckbox, HTMLElement {}
export const DgaCheckbox: {
    prototype: DgaCheckbox;
    new (): DgaCheckbox;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
