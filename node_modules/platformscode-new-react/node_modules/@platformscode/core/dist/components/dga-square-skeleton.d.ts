import type { Components, JSX } from "../types/components";

interface DgaSquareSkeleton extends Components.DgaSquareSkeleton, HTMLElement {}
export const DgaSquareSkeleton: {
    prototype: DgaSquareSkeleton;
    new (): DgaSquareSkeleton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
