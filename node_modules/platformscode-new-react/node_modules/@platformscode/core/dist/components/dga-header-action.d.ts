import type { Components, JSX } from "../types/components";

interface DgaHeaderAction extends Components.DgaHeaderAction, HTMLElement {}
export const DgaHeaderAction: {
    prototype: DgaHeaderAction;
    new (): DgaHeaderAction;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
