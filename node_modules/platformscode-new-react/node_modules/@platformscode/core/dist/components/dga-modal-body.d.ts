import type { Components, JSX } from "../types/components";

interface DgaModalBody extends Components.DgaModalBody, HTMLElement {}
export const DgaModalBody: {
    prototype: DgaModalBody;
    new (): DgaModalBody;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
