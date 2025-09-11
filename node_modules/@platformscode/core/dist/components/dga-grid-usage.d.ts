import type { Components, JSX } from "../types/components";

interface DgaGridUsage extends Components.DgaGridUsage, HTMLElement {}
export const DgaGridUsage: {
    prototype: DgaGridUsage;
    new (): DgaGridUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
