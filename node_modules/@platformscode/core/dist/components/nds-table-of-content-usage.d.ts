import type { Components, JSX } from "../types/components";

interface NdsTableOfContentUsage extends Components.NdsTableOfContentUsage, HTMLElement {}
export const NdsTableOfContentUsage: {
    prototype: NdsTableOfContentUsage;
    new (): NdsTableOfContentUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
