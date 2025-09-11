import type { Components, JSX } from "../types/components";

interface DgaCardImage extends Components.DgaCardImage, HTMLElement {}
export const DgaCardImage: {
    prototype: DgaCardImage;
    new (): DgaCardImage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
