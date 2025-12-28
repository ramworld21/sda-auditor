import type { Components, JSX } from "../types/components";

interface DgaContentSwitcher extends Components.DgaContentSwitcher, HTMLElement {}
export const DgaContentSwitcher: {
    prototype: DgaContentSwitcher;
    new (): DgaContentSwitcher;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
