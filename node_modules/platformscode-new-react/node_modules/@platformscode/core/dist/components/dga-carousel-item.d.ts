import type { Components, JSX } from "../types/components";

interface DgaCarouselItem extends Components.DgaCarouselItem, HTMLElement {}
export const DgaCarouselItem: {
    prototype: DgaCarouselItem;
    new (): DgaCarouselItem;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
