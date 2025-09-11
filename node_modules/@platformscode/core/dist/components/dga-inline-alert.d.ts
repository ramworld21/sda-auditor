import type { Components, JSX } from "../types/components";

interface DgaInlineAlert extends Components.DgaInlineAlert, HTMLElement {}
export const DgaInlineAlert: {
    prototype: DgaInlineAlert;
    new (): DgaInlineAlert;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
