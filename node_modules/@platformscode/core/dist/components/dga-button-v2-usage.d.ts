import type { Components, JSX } from "../types/components";

interface DgaButtonV2Usage extends Components.DgaButtonV2Usage, HTMLElement {}
export const DgaButtonV2Usage: {
    prototype: DgaButtonV2Usage;
    new (): DgaButtonV2Usage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
