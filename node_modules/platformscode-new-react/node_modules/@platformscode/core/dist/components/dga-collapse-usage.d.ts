import type { Components, JSX } from "../types/components";

interface DgaCollapseUsage extends Components.DgaCollapseUsage, HTMLElement {}
export const DgaCollapseUsage: {
    prototype: DgaCollapseUsage;
    new (): DgaCollapseUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
