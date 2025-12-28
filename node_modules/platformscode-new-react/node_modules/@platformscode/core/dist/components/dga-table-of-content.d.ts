import type { Components, JSX } from "../types/components";

interface DgaTableOfContent extends Components.DgaTableOfContent, HTMLElement {}
export const DgaTableOfContent: {
    prototype: DgaTableOfContent;
    new (): DgaTableOfContent;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
