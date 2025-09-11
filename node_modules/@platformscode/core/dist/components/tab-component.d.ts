import type { Components, JSX } from "../types/components";

interface TabComponent extends Components.TabComponent, HTMLElement {}
export const TabComponent: {
    prototype: TabComponent;
    new (): TabComponent;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
