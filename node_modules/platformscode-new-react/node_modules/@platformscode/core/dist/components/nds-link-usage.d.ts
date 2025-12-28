import type { Components, JSX } from "../types/components";

interface NdsLinkUsage extends Components.NdsLinkUsage, HTMLElement {}
export const NdsLinkUsage: {
    prototype: NdsLinkUsage;
    new (): NdsLinkUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
