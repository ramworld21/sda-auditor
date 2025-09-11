import type { Components, JSX } from "../types/components";

interface DgaSwitchUsage extends Components.DgaSwitchUsage, HTMLElement {}
export const DgaSwitchUsage: {
    prototype: DgaSwitchUsage;
    new (): DgaSwitchUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
