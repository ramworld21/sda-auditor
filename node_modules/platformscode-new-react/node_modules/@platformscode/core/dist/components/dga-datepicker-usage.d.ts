import type { Components, JSX } from "../types/components";

interface DgaDatepickerUsage extends Components.DgaDatepickerUsage, HTMLElement {}
export const DgaDatepickerUsage: {
    prototype: DgaDatepickerUsage;
    new (): DgaDatepickerUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
