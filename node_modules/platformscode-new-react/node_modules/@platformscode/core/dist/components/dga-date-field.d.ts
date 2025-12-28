import type { Components, JSX } from "../types/components";

interface DgaDateField extends Components.DgaDateField, HTMLElement {}
export const DgaDateField: {
    prototype: DgaDateField;
    new (): DgaDateField;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
