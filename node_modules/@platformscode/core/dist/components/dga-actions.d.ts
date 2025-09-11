import type { Components, JSX } from "../types/components";

interface DgaActions extends Components.DgaActions, HTMLElement {}
export const DgaActions: {
    prototype: DgaActions;
    new (): DgaActions;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
