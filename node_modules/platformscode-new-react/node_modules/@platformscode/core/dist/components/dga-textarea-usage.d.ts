import type { Components, JSX } from "../types/components";

interface DgaTextareaUsage extends Components.DgaTextareaUsage, HTMLElement {}
export const DgaTextareaUsage: {
    prototype: DgaTextareaUsage;
    new (): DgaTextareaUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
