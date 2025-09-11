import type { Components, JSX } from "../types/components";

interface DgaModalHeader extends Components.DgaModalHeader, HTMLElement {}
export const DgaModalHeader: {
    prototype: DgaModalHeader;
    new (): DgaModalHeader;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
