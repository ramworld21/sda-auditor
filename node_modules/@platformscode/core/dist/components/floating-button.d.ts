import type { Components, JSX } from "../types/components";

interface FloatingButton extends Components.FloatingButton, HTMLElement {}
export const FloatingButton: {
    prototype: FloatingButton;
    new (): FloatingButton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
