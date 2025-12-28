import type { Components, JSX } from "../types/components";

interface DgaSlideoutMenuHeader extends Components.DgaSlideoutMenuHeader, HTMLElement {}
export const DgaSlideoutMenuHeader: {
    prototype: DgaSlideoutMenuHeader;
    new (): DgaSlideoutMenuHeader;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
