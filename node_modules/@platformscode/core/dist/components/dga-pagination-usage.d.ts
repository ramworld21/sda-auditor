import type { Components, JSX } from "../types/components";

interface DgaPaginationUsage extends Components.DgaPaginationUsage, HTMLElement {}
export const DgaPaginationUsage: {
    prototype: DgaPaginationUsage;
    new (): DgaPaginationUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
