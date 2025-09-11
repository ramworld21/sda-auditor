import type { Components, JSX } from "../types/components";

interface DgaChip extends Components.DgaChip, HTMLElement {}
export const DgaChip: {
    prototype: DgaChip;
    new (): DgaChip;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
