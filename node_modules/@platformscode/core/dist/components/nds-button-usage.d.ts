import type { Components, JSX } from "../types/components";

interface NdsButtonUsage extends Components.NdsButtonUsage, HTMLElement {}
export const NdsButtonUsage: {
    prototype: NdsButtonUsage;
    new (): NdsButtonUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
