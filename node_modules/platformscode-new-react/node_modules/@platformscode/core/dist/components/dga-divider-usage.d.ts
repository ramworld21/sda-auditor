import type { Components, JSX } from "../types/components";

interface DgaDividerUsage extends Components.DgaDividerUsage, HTMLElement {}
export const DgaDividerUsage: {
    prototype: DgaDividerUsage;
    new (): DgaDividerUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
