import type { Components, JSX } from "../types/components";

interface DgaTag extends Components.DgaTag, HTMLElement {}
export const DgaTag: {
    prototype: DgaTag;
    new (): DgaTag;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
