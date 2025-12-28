import type { Components, JSX } from "../types/components";

interface DgaTableUsage extends Components.DgaTableUsage, HTMLElement {}
export const DgaTableUsage: {
    prototype: DgaTableUsage;
    new (): DgaTableUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
