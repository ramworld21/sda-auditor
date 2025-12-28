import type { Components, JSX } from "../types/components";

interface DgaTagUsage extends Components.DgaTagUsage, HTMLElement {}
export const DgaTagUsage: {
    prototype: DgaTagUsage;
    new (): DgaTagUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
