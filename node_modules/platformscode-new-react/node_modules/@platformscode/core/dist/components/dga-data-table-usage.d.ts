import type { Components, JSX } from "../types/components";

interface DgaDataTableUsage extends Components.DgaDataTableUsage, HTMLElement {}
export const DgaDataTableUsage: {
    prototype: DgaDataTableUsage;
    new (): DgaDataTableUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
