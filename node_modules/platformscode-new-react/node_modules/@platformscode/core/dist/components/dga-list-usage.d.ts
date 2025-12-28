import type { Components, JSX } from "../types/components";

interface DgaListUsage extends Components.DgaListUsage, HTMLElement {}
export const DgaListUsage: {
    prototype: DgaListUsage;
    new (): DgaListUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
