import type { Components, JSX } from "../types/components";

interface DgaSlideoutMenuItems extends Components.DgaSlideoutMenuItems, HTMLElement {}
export const DgaSlideoutMenuItems: {
    prototype: DgaSlideoutMenuItems;
    new (): DgaSlideoutMenuItems;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
