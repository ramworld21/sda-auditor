import type { Components, JSX } from "../types/components";

interface DgaLink extends Components.DgaLink, HTMLElement {}
export const DgaLink: {
    prototype: DgaLink;
    new (): DgaLink;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
