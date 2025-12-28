import type { Components, JSX } from "../types/components";

interface DgaModalUsage extends Components.DgaModalUsage, HTMLElement {}
export const DgaModalUsage: {
    prototype: DgaModalUsage;
    new (): DgaModalUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
