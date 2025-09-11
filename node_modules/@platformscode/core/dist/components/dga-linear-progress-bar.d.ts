import type { Components, JSX } from "../types/components";

interface DgaLinearProgressBar extends Components.DgaLinearProgressBar, HTMLElement {}
export const DgaLinearProgressBar: {
    prototype: DgaLinearProgressBar;
    new (): DgaLinearProgressBar;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
