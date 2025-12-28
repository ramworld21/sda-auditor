import type { Components, JSX } from "../types/components";

interface DgaLoadingUsage extends Components.DgaLoadingUsage, HTMLElement {}
export const DgaLoadingUsage: {
    prototype: DgaLoadingUsage;
    new (): DgaLoadingUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
