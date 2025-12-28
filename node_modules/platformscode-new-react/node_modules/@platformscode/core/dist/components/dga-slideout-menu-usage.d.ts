import type { Components, JSX } from "../types/components";

interface DgaSlideoutMenuUsage extends Components.DgaSlideoutMenuUsage, HTMLElement {}
export const DgaSlideoutMenuUsage: {
    prototype: DgaSlideoutMenuUsage;
    new (): DgaSlideoutMenuUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
