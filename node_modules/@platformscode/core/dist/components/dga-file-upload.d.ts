import type { Components, JSX } from "../types/components";

interface DgaFileUpload extends Components.DgaFileUpload, HTMLElement {}
export const DgaFileUpload: {
    prototype: DgaFileUpload;
    new (): DgaFileUpload;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
