import type { Components, JSX } from "../types/components";

interface NdsChip extends Components.NdsChip, HTMLElement {}
export const NdsChip: {
    prototype: NdsChip;
    new (): NdsChip;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
