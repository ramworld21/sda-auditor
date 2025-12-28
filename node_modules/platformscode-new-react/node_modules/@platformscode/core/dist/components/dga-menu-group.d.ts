import type { Components, JSX } from "../types/components";

interface DgaMenuGroup extends Components.DgaMenuGroup, HTMLElement {}
export const DgaMenuGroup: {
    prototype: DgaMenuGroup;
    new (): DgaMenuGroup;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
