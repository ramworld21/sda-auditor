import type { Components, JSX } from "../types/components";

interface DateCell extends Components.DateCell, HTMLElement {}
export const DateCell: {
    prototype: DateCell;
    new (): DateCell;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
