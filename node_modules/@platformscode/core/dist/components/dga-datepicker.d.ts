import type { Components, JSX } from "../types/components";

interface DgaDatepicker extends Components.DgaDatepicker, HTMLElement {}
export const DgaDatepicker: {
    prototype: DgaDatepicker;
    new (): DgaDatepicker;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
