import type { Components, JSX } from "../types/components";

interface NdsTableOfContent extends Components.NdsTableOfContent, HTMLElement {}
export const NdsTableOfContent: {
    prototype: NdsTableOfContent;
    new (): NdsTableOfContent;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
