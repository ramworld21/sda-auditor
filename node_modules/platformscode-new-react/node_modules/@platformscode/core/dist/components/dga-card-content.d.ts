import type { Components, JSX } from "../types/components";

interface DgaCardContent extends Components.DgaCardContent, HTMLElement {}
export const DgaCardContent: {
    prototype: DgaCardContent;
    new (): DgaCardContent;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
