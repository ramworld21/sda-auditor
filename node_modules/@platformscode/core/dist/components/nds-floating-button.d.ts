import type { Components, JSX } from "../types/components";

interface NdsFloatingButton extends Components.NdsFloatingButton, HTMLElement {}
export const NdsFloatingButton: {
    prototype: NdsFloatingButton;
    new (): NdsFloatingButton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
