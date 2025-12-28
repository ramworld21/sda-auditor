import type { Components, JSX } from "../types/components";

interface DgaNotificationToast extends Components.DgaNotificationToast, HTMLElement {}
export const DgaNotificationToast: {
    prototype: DgaNotificationToast;
    new (): DgaNotificationToast;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
