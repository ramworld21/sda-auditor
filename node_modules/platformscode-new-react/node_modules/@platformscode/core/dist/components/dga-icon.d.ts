import type { Components, JSX } from "../types/components";

interface DgaIcon extends Components.DgaIcon, HTMLElement {}
export const DgaIcon: {
    prototype: DgaIcon;
    new (): DgaIcon;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
