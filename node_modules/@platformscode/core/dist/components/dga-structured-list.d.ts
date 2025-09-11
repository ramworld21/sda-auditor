import type { Components, JSX } from "../types/components";

interface DgaStructuredList extends Components.DgaStructuredList, HTMLElement {}
export const DgaStructuredList: {
    prototype: DgaStructuredList;
    new (): DgaStructuredList;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
