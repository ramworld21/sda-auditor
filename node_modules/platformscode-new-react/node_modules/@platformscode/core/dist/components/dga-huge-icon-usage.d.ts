import type { Components, JSX } from "../types/components";

interface DgaHugeIconUsage extends Components.DgaHugeIconUsage, HTMLElement {}
export const DgaHugeIconUsage: {
    prototype: DgaHugeIconUsage;
    new (): DgaHugeIconUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
