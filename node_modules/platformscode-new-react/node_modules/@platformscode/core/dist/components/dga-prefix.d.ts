import type { Components, JSX } from "../types/components";

interface DgaPrefix extends Components.DgaPrefix, HTMLElement {}
export const DgaPrefix: {
    prototype: DgaPrefix;
    new (): DgaPrefix;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
