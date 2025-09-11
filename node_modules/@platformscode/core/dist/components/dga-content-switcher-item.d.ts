import type { Components, JSX } from "../types/components";

interface DgaContentSwitcherItem extends Components.DgaContentSwitcherItem, HTMLElement {}
export const DgaContentSwitcherItem: {
    prototype: DgaContentSwitcherItem;
    new (): DgaContentSwitcherItem;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
