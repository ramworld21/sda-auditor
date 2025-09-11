import type { Components, JSX } from "../types/components";

interface DgaSearchBox extends Components.DgaSearchBox, HTMLElement {}
export const DgaSearchBox: {
    prototype: DgaSearchBox;
    new (): DgaSearchBox;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
