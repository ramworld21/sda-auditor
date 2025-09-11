import type { Components, JSX } from "../types/components";

interface DgaLogoPlaceholder extends Components.DgaLogoPlaceholder, HTMLElement {}
export const DgaLogoPlaceholder: {
    prototype: DgaLogoPlaceholder;
    new (): DgaLogoPlaceholder;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
