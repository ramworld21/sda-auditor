import type { Components, JSX } from "../types/components";

interface DgaSuffix extends Components.DgaSuffix, HTMLElement {}
export const DgaSuffix: {
    prototype: DgaSuffix;
    new (): DgaSuffix;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
