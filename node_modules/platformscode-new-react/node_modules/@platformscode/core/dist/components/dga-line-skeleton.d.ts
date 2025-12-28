import type { Components, JSX } from "../types/components";

interface DgaLineSkeleton extends Components.DgaLineSkeleton, HTMLElement {}
export const DgaLineSkeleton: {
    prototype: DgaLineSkeleton;
    new (): DgaLineSkeleton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
