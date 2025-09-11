import type { Components, JSX } from "../types/components";

interface DgaFlex extends Components.DgaFlex, HTMLElement {}
export const DgaFlex: {
    prototype: DgaFlex;
    new (): DgaFlex;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
