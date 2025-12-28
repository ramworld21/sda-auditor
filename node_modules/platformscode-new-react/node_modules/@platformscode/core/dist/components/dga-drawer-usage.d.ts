import type { Components, JSX } from "../types/components";

interface DgaDrawerUsage extends Components.DgaDrawerUsage, HTMLElement {}
export const DgaDrawerUsage: {
    prototype: DgaDrawerUsage;
    new (): DgaDrawerUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
