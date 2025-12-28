import type { Components, JSX } from "../types/components";

interface DgaDivider extends Components.DgaDivider, HTMLElement {}
export const DgaDivider: {
    prototype: DgaDivider;
    new (): DgaDivider;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
