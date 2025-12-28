import type { Components, JSX } from "../types/components";

interface DgaCircularProgressBar extends Components.DgaCircularProgressBar, HTMLElement {}
export const DgaCircularProgressBar: {
    prototype: DgaCircularProgressBar;
    new (): DgaCircularProgressBar;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
