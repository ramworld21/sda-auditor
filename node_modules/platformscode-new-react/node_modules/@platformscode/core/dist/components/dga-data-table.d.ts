import type { Components, JSX } from "../types/components";

interface DgaDataTable extends Components.DgaDataTable, HTMLElement {}
export const DgaDataTable: {
    prototype: DgaDataTable;
    new (): DgaDataTable;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
