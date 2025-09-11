import type { Components, JSX } from "../types/components";

interface DgaAvatarGroup extends Components.DgaAvatarGroup, HTMLElement {}
export const DgaAvatarGroup: {
    prototype: DgaAvatarGroup;
    new (): DgaAvatarGroup;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
