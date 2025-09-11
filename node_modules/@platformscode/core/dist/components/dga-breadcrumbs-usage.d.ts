import type { Components, JSX } from "../types/components";

interface DgaBreadcrumbsUsage extends Components.DgaBreadcrumbsUsage, HTMLElement {}
export const DgaBreadcrumbsUsage: {
    prototype: DgaBreadcrumbsUsage;
    new (): DgaBreadcrumbsUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
