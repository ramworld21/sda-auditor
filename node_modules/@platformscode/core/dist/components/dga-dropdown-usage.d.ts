import type { Components, JSX } from "../types/components";

interface DgaDropdownUsage extends Components.DgaDropdownUsage, HTMLElement {}
export const DgaDropdownUsage: {
    prototype: DgaDropdownUsage;
    new (): DgaDropdownUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
