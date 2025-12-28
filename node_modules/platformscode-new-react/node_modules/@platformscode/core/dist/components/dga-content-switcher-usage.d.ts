import type { Components, JSX } from "../types/components";

interface DgaContentSwitcherUsage extends Components.DgaContentSwitcherUsage, HTMLElement {}
export const DgaContentSwitcherUsage: {
    prototype: DgaContentSwitcherUsage;
    new (): DgaContentSwitcherUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
