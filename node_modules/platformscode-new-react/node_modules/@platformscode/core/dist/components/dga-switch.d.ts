import type { Components, JSX } from "../types/components";

interface DgaSwitch extends Components.DgaSwitch, HTMLElement {}
export const DgaSwitch: {
    prototype: DgaSwitch;
    new (): DgaSwitch;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
