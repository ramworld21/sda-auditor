import type { Components, JSX } from "../types/components";

interface DgaTable extends Components.DgaTable, HTMLElement {}
export const DgaTable: {
    prototype: DgaTable;
    new (): DgaTable;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
