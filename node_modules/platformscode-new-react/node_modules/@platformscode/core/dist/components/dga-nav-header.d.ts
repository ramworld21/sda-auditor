import type { Components, JSX } from "../types/components";

interface DgaNavHeader extends Components.DgaNavHeader, HTMLElement {}
export const DgaNavHeader: {
    prototype: DgaNavHeader;
    new (): DgaNavHeader;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
