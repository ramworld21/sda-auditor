import type { Components, JSX } from "../types/components";

interface DgaBreadcrumbs extends Components.DgaBreadcrumbs, HTMLElement {}
export const DgaBreadcrumbs: {
    prototype: DgaBreadcrumbs;
    new (): DgaBreadcrumbs;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
