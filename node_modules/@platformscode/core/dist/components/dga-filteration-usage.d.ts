import type { Components, JSX } from "../types/components";

interface DgaFilterationUsage extends Components.DgaFilterationUsage, HTMLElement {}
export const DgaFilterationUsage: {
    prototype: DgaFilterationUsage;
    new (): DgaFilterationUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
