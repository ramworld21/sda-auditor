import type { Components, JSX } from "../types/components";

interface SubmenuComponent extends Components.SubmenuComponent, HTMLElement {}
export const SubmenuComponent: {
    prototype: SubmenuComponent;
    new (): SubmenuComponent;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
