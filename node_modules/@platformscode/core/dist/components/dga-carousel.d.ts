import type { Components, JSX } from "../types/components";

interface DgaCarousel extends Components.DgaCarousel, HTMLElement {}
export const DgaCarousel: {
    prototype: DgaCarousel;
    new (): DgaCarousel;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
