import type { Components, JSX } from "../types/components";

interface DgaCardUsage extends Components.DgaCardUsage, HTMLElement {}
export const DgaCardUsage: {
    prototype: DgaCardUsage;
    new (): DgaCardUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
