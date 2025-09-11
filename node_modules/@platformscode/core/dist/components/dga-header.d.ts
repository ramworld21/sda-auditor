import type { Components, JSX } from "../types/components";

interface DgaHeader extends Components.DgaHeader, HTMLElement {}
export const DgaHeader: {
    prototype: DgaHeader;
    new (): DgaHeader;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
