import type { Components, JSX } from "../types/components";

interface DgaGridItem extends Components.DgaGridItem, HTMLElement {}
export const DgaGridItem: {
    prototype: DgaGridItem;
    new (): DgaGridItem;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
