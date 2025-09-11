import type { Components, JSX } from "../types/components";

interface DgaNotificationToastUsage extends Components.DgaNotificationToastUsage, HTMLElement {}
export const DgaNotificationToastUsage: {
    prototype: DgaNotificationToastUsage;
    new (): DgaNotificationToastUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
