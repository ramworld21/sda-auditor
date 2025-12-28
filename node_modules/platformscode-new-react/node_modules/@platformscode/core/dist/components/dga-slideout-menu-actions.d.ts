import type { Components, JSX } from "../types/components";

interface DgaSlideoutMenuActions extends Components.DgaSlideoutMenuActions, HTMLElement {}
export const DgaSlideoutMenuActions: {
    prototype: DgaSlideoutMenuActions;
    new (): DgaSlideoutMenuActions;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
