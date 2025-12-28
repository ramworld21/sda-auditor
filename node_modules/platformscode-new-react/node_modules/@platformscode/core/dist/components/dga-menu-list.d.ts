import type { Components, JSX } from "../types/components";

interface DgaMenuList extends Components.DgaMenuList, HTMLElement {}
export const DgaMenuList: {
    prototype: DgaMenuList;
    new (): DgaMenuList;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
