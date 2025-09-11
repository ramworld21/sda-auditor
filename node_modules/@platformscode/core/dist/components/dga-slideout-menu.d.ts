import type { Components, JSX } from "../types/components";

interface DgaSlideoutMenu extends Components.DgaSlideoutMenu, HTMLElement {}
export const DgaSlideoutMenu: {
    prototype: DgaSlideoutMenu;
    new (): DgaSlideoutMenu;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
