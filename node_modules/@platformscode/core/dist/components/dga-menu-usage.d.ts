import type { Components, JSX } from "../types/components";

interface DgaMenuUsage extends Components.DgaMenuUsage, HTMLElement {}
export const DgaMenuUsage: {
    prototype: DgaMenuUsage;
    new (): DgaMenuUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
