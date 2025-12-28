import type { Components, JSX } from "../types/components";

interface DgaGridContainer extends Components.DgaGridContainer, HTMLElement {}
export const DgaGridContainer: {
    prototype: DgaGridContainer;
    new (): DgaGridContainer;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
