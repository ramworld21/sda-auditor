import type { Components, JSX } from "../types/components";

interface DgaAvatarUsage extends Components.DgaAvatarUsage, HTMLElement {}
export const DgaAvatarUsage: {
    prototype: DgaAvatarUsage;
    new (): DgaAvatarUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
