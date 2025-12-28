import type { Components, JSX } from "../types/components";

interface DgaAvatar extends Components.DgaAvatar, HTMLElement {}
export const DgaAvatar: {
    prototype: DgaAvatar;
    new (): DgaAvatar;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
