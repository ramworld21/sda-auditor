import type { Components, JSX } from "../types/components";

interface DgaCardActions extends Components.DgaCardActions, HTMLElement {}
export const DgaCardActions: {
    prototype: DgaCardActions;
    new (): DgaCardActions;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
