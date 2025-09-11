import type { Components, JSX } from "../types/components";

interface DgaCardV2Usage extends Components.DgaCardV2Usage, HTMLElement {}
export const DgaCardV2Usage: {
    prototype: DgaCardV2Usage;
    new (): DgaCardV2Usage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
