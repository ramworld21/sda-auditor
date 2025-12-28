import type { Components, JSX } from "../types/components";

interface DgaLabel extends Components.DgaLabel, HTMLElement {}
export const DgaLabel: {
    prototype: DgaLabel;
    new (): DgaLabel;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
