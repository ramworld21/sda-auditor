import type { Components, JSX } from "../types/components";

interface DgaDateFieldUsage extends Components.DgaDateFieldUsage, HTMLElement {}
export const DgaDateFieldUsage: {
    prototype: DgaDateFieldUsage;
    new (): DgaDateFieldUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
