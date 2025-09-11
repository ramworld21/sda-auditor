import type { Components, JSX } from "../types/components";

interface DgaTabsUsage extends Components.DgaTabsUsage, HTMLElement {}
export const DgaTabsUsage: {
    prototype: DgaTabsUsage;
    new (): DgaTabsUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
