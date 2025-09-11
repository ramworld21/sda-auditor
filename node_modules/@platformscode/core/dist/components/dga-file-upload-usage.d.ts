import type { Components, JSX } from "../types/components";

interface DgaFileUploadUsage extends Components.DgaFileUploadUsage, HTMLElement {}
export const DgaFileUploadUsage: {
    prototype: DgaFileUploadUsage;
    new (): DgaFileUploadUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
