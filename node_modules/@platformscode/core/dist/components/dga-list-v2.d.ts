import type { Components, JSX } from "../types/components";

interface DgaListV2 extends Components.DgaListV2, HTMLElement {}
export const DgaListV2: {
    prototype: DgaListV2;
    new (): DgaListV2;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
