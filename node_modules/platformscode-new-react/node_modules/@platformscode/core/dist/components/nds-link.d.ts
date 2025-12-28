import type { Components, JSX } from "../types/components";

interface NdsLink extends Components.NdsLink, HTMLElement {}
export const NdsLink: {
    prototype: NdsLink;
    new (): NdsLink;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
