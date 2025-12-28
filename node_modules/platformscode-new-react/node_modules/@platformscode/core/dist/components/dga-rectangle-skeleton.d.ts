import type { Components, JSX } from "../types/components";

interface DgaRectangleSkeleton extends Components.DgaRectangleSkeleton, HTMLElement {}
export const DgaRectangleSkeleton: {
    prototype: DgaRectangleSkeleton;
    new (): DgaRectangleSkeleton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
