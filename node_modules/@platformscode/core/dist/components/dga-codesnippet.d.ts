import type { Components, JSX } from "../types/components";

interface DgaCodesnippet extends Components.DgaCodesnippet, HTMLElement {}
export const DgaCodesnippet: {
    prototype: DgaCodesnippet;
    new (): DgaCodesnippet;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
