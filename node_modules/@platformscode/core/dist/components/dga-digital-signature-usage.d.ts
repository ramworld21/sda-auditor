import type { Components, JSX } from "../types/components";

interface DgaDigitalSignatureUsage extends Components.DgaDigitalSignatureUsage, HTMLElement {}
export const DgaDigitalSignatureUsage: {
    prototype: DgaDigitalSignatureUsage;
    new (): DgaDigitalSignatureUsage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
