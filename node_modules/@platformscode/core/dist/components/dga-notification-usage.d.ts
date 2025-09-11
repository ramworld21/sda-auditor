import type { Components, JSX } from "../types/components";

interface DgaNotificationUsage extends Components.DgaNotificationUsage, HTMLElement {}
export const DgaNotificationUsage: {
    prototype: DgaNotificationUsage;
    new (): DgaNotificationUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
