import type { Components, JSX } from "../types/components";

interface DgaCollapse extends Components.DgaCollapse, HTMLElement {}
export const DgaCollapse: {
    prototype: DgaCollapse;
    new (): DgaCollapse;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
