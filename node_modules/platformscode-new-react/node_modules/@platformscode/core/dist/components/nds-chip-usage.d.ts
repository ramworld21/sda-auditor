import type { Components, JSX } from "../types/components";

interface NdsChipUsage extends Components.NdsChipUsage, HTMLElement {}
export const NdsChipUsage: {
    prototype: NdsChipUsage;
    new (): NdsChipUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
