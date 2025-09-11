import type { Components, JSX } from "../types/components";

interface DgaHeaderUsage extends Components.DgaHeaderUsage, HTMLElement {}
export const DgaHeaderUsage: {
    prototype: DgaHeaderUsage;
    new (): DgaHeaderUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
