import type { Components, JSX } from "../types/components";

interface NdsAvatar extends Components.NdsAvatar, HTMLElement {}
export const NdsAvatar: {
    prototype: NdsAvatar;
    new (): NdsAvatar;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
