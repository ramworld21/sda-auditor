import type { Components, JSX } from "../types/components";

interface DgaNumberInput extends Components.DgaNumberInput, HTMLElement {}
export const DgaNumberInput: {
    prototype: DgaNumberInput;
    new (): DgaNumberInput;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
