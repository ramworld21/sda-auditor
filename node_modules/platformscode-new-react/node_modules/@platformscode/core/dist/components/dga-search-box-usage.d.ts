import type { Components, JSX } from "../types/components";

interface DgaSearchBoxUsage extends Components.DgaSearchBoxUsage, HTMLElement {}
export const DgaSearchBoxUsage: {
    prototype: DgaSearchBoxUsage;
    new (): DgaSearchBoxUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
