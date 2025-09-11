import type { Components, JSX } from "../types/components";

interface DgaTextarea extends Components.DgaTextarea, HTMLElement {}
export const DgaTextarea: {
    prototype: DgaTextarea;
    new (): DgaTextarea;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
