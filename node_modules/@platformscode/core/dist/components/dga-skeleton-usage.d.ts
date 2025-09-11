import type { Components, JSX } from "../types/components";

interface DgaSkeletonUsage extends Components.DgaSkeletonUsage, HTMLElement {}
export const DgaSkeletonUsage: {
    prototype: DgaSkeletonUsage;
    new (): DgaSkeletonUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
