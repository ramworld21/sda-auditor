import type { Components, JSX } from "../types/components";

interface DgaTableOfContentUsage extends Components.DgaTableOfContentUsage, HTMLElement {}
export const DgaTableOfContentUsage: {
    prototype: DgaTableOfContentUsage;
    new (): DgaTableOfContentUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
