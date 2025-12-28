import type { Components, JSX } from "../types/components";

interface TabLink extends Components.TabLink, HTMLElement {}
export const TabLink: {
    prototype: TabLink;
    new (): TabLink;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
