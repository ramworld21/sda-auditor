import type { Components, JSX } from "../types/components";

interface DgaDropdown extends Components.DgaDropdown, HTMLElement {}
export const DgaDropdown: {
    prototype: DgaDropdown;
    new (): DgaDropdown;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
