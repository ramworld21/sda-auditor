import type { Components, JSX } from "../types/components";

interface DgaStatusTag extends Components.DgaStatusTag, HTMLElement {}
export const DgaStatusTag: {
    prototype: DgaStatusTag;
    new (): DgaStatusTag;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
