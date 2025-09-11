import type { Components, JSX } from "../types/components";

interface DgaSkeletonComponent extends Components.DgaSkeletonComponent, HTMLElement {}
export const DgaSkeletonComponent: {
    prototype: DgaSkeletonComponent;
    new (): DgaSkeletonComponent;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
