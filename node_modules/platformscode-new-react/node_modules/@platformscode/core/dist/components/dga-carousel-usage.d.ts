import type { Components, JSX } from "../types/components";

interface DgaCarouselUsage extends Components.DgaCarouselUsage, HTMLElement {}
export const DgaCarouselUsage: {
    prototype: DgaCarouselUsage;
    new (): DgaCarouselUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
