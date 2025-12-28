import type { Components, JSX } from "../types/components";

interface DgaLinkUsage extends Components.DgaLinkUsage, HTMLElement {}
export const DgaLinkUsage: {
    prototype: DgaLinkUsage;
    new (): DgaLinkUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
