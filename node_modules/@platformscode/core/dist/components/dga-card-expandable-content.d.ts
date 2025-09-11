import type { Components, JSX } from "../types/components";

interface DgaCardExpandableContent extends Components.DgaCardExpandableContent, HTMLElement {}
export const DgaCardExpandableContent: {
    prototype: DgaCardExpandableContent;
    new (): DgaCardExpandableContent;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
