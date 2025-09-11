import type { Components, JSX } from "../types/components";

interface DgaTabs extends Components.DgaTabs, HTMLElement {}
export const DgaTabs: {
    prototype: DgaTabs;
    new (): DgaTabs;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
