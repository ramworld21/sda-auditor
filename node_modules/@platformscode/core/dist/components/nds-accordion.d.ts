import type { Components, JSX } from "../types/components";

interface NdsAccordion extends Components.NdsAccordion, HTMLElement {}
export const NdsAccordion: {
    prototype: NdsAccordion;
    new (): NdsAccordion;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
