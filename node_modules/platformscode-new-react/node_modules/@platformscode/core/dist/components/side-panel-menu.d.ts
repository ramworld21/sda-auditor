import type { Components, JSX } from "../types/components";

interface SidePanelMenu extends Components.SidePanelMenu, HTMLElement {}
export const SidePanelMenu: {
    prototype: SidePanelMenu;
    new (): SidePanelMenu;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
