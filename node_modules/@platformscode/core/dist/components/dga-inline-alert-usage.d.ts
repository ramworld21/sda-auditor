import type { Components, JSX } from "../types/components";

interface DgaInlineAlertUsage extends Components.DgaInlineAlertUsage, HTMLElement {}
export const DgaInlineAlertUsage: {
    prototype: DgaInlineAlertUsage;
    new (): DgaInlineAlertUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
