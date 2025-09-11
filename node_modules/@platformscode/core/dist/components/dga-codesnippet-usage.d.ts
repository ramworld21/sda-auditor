import type { Components, JSX } from "../types/components";

interface DgaCodesnippetUsage extends Components.DgaCodesnippetUsage, HTMLElement {}
export const DgaCodesnippetUsage: {
    prototype: DgaCodesnippetUsage;
    new (): DgaCodesnippetUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
