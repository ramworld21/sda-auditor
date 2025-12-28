import type { Components, JSX } from "../types/components";

interface DgaNumberInputUsage extends Components.DgaNumberInputUsage, HTMLElement {}
export const DgaNumberInputUsage: {
    prototype: DgaNumberInputUsage;
    new (): DgaNumberInputUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
