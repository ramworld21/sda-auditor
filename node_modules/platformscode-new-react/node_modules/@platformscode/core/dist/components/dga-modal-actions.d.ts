import type { Components, JSX } from "../types/components";

interface DgaModalActions extends Components.DgaModalActions, HTMLElement {}
export const DgaModalActions: {
    prototype: DgaModalActions;
    new (): DgaModalActions;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
