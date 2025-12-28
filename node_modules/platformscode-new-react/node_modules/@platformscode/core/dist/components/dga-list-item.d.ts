import type { Components, JSX } from "../types/components";

interface DgaListItem extends Components.DgaListItem, HTMLElement {}
export const DgaListItem: {
    prototype: DgaListItem;
    new (): DgaListItem;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
