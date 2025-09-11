import type { Components, JSX } from "../types/components";

interface DgaModal extends Components.DgaModal, HTMLElement {}
export const DgaModal: {
    prototype: DgaModal;
    new (): DgaModal;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
