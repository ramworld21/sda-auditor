import type { Components, JSX } from "../types/components";

interface DgaPagination extends Components.DgaPagination, HTMLElement {}
export const DgaPagination: {
    prototype: DgaPagination;
    new (): DgaPagination;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
