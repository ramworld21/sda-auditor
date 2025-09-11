import type { Components, JSX } from "../types/components";

interface DgaButtonUsage extends Components.DgaButtonUsage, HTMLElement {}
export const DgaButtonUsage: {
    prototype: DgaButtonUsage;
    new (): DgaButtonUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
