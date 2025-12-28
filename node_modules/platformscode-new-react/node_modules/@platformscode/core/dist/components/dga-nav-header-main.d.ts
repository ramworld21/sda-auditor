import type { Components, JSX } from "../types/components";

interface DgaNavHeaderMain extends Components.DgaNavHeaderMain, HTMLElement {}
export const DgaNavHeaderMain: {
    prototype: DgaNavHeaderMain;
    new (): DgaNavHeaderMain;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
