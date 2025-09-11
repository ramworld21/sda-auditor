import type { Components, JSX } from "../types/components";

interface DgaFloatingButtonUsage extends Components.DgaFloatingButtonUsage, HTMLElement {}
export const DgaFloatingButtonUsage: {
    prototype: DgaFloatingButtonUsage;
    new (): DgaFloatingButtonUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
