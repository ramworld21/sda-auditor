import type { Components, JSX } from "../types/components";

interface DgaNotification extends Components.DgaNotification, HTMLElement {}
export const DgaNotification: {
    prototype: DgaNotification;
    new (): DgaNotification;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
