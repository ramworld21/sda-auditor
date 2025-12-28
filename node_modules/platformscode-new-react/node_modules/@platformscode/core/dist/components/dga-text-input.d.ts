import type { Components, JSX } from "../types/components";

interface DgaTextInput extends Components.DgaTextInput, HTMLElement {}
export const DgaTextInput: {
    prototype: DgaTextInput;
    new (): DgaTextInput;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
