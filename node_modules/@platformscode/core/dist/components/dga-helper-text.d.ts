import type { Components, JSX } from "../types/components";

interface DgaHelperText extends Components.DgaHelperText, HTMLElement {}
export const DgaHelperText: {
    prototype: DgaHelperText;
    new (): DgaHelperText;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
