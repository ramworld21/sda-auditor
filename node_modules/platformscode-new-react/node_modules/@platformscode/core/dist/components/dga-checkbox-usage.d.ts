import type { Components, JSX } from "../types/components";

interface DgaCheckboxUsage extends Components.DgaCheckboxUsage, HTMLElement {}
export const DgaCheckboxUsage: {
    prototype: DgaCheckboxUsage;
    new (): DgaCheckboxUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
