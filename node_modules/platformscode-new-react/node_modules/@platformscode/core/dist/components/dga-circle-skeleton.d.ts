import type { Components, JSX } from "../types/components";

interface DgaCircleSkeleton extends Components.DgaCircleSkeleton, HTMLElement {}
export const DgaCircleSkeleton: {
    prototype: DgaCircleSkeleton;
    new (): DgaCircleSkeleton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
