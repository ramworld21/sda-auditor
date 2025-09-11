import type { Components, JSX } from "../types/components";

interface NdsButton extends Components.NdsButton, HTMLElement {}
export const NdsButton: {
    prototype: NdsButton;
    new (): NdsButton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
