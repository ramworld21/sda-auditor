import type { Components, JSX } from "../types/components";

interface DgaChipUsage extends Components.DgaChipUsage, HTMLElement {}
export const DgaChipUsage: {
    prototype: DgaChipUsage;
    new (): DgaChipUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
