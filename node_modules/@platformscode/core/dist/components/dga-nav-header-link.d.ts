import type { Components, JSX } from "../types/components";

interface DgaNavHeaderLink extends Components.DgaNavHeaderLink, HTMLElement {}
export const DgaNavHeaderLink: {
    prototype: DgaNavHeaderLink;
    new (): DgaNavHeaderLink;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
