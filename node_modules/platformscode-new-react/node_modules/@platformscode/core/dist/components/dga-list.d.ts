import type { Components, JSX } from "../types/components";

interface DgaList extends Components.DgaList, HTMLElement {}
export const DgaList: {
    prototype: DgaList;
    new (): DgaList;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
