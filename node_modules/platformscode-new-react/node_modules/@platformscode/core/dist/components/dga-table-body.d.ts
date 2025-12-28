import type { Components, JSX } from "../types/components";

interface DgaTableBody extends Components.DgaTableBody, HTMLElement {}
export const DgaTableBody: {
    prototype: DgaTableBody;
    new (): DgaTableBody;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
