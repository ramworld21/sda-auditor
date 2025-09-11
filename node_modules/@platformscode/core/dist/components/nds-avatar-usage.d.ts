import type { Components, JSX } from "../types/components";

interface NdsAvatarUsage extends Components.NdsAvatarUsage, HTMLElement {}
export const NdsAvatarUsage: {
    prototype: NdsAvatarUsage;
    new (): NdsAvatarUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
