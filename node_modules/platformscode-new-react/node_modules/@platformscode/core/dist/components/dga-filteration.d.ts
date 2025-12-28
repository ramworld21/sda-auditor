import type { Components, JSX } from "../types/components";

interface DgaFilteration extends Components.DgaFilteration, HTMLElement {}
export const DgaFilteration: {
    prototype: DgaFilteration;
    new (): DgaFilteration;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
