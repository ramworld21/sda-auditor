import type { Components, JSX } from "../types/components";

interface NdsFloatingButtonUsage extends Components.NdsFloatingButtonUsage, HTMLElement {}
export const NdsFloatingButtonUsage: {
    prototype: NdsFloatingButtonUsage;
    new (): NdsFloatingButtonUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
