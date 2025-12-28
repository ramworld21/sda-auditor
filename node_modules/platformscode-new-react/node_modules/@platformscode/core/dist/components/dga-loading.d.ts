import type { Components, JSX } from "../types/components";

interface DgaLoading extends Components.DgaLoading, HTMLElement {}
export const DgaLoading: {
    prototype: DgaLoading;
    new (): DgaLoading;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
