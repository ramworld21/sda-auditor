import type { Components, JSX } from "../types/components";

interface DgaNavHeaderActions extends Components.DgaNavHeaderActions, HTMLElement {}
export const DgaNavHeaderActions: {
    prototype: DgaNavHeaderActions;
    new (): DgaNavHeaderActions;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
