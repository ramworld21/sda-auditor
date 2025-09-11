import type { Components, JSX } from "../types/components";

interface DgaFooterUsage extends Components.DgaFooterUsage, HTMLElement {}
export const DgaFooterUsage: {
    prototype: DgaFooterUsage;
    new (): DgaFooterUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
