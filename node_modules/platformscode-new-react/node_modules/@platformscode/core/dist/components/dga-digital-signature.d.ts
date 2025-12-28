import type { Components, JSX } from "../types/components";

interface DgaDigitalSignature extends Components.DgaDigitalSignature, HTMLElement {}
export const DgaDigitalSignature: {
    prototype: DgaDigitalSignature;
    new (): DgaDigitalSignature;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
