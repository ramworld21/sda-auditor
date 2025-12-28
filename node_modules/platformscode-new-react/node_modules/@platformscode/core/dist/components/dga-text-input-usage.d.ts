import type { Components, JSX } from "../types/components";

interface DgaTextInputUsage extends Components.DgaTextInputUsage, HTMLElement {}
export const DgaTextInputUsage: {
    prototype: DgaTextInputUsage;
    new (): DgaTextInputUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
