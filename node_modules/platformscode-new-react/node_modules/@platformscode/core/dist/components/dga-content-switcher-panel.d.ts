import type { Components, JSX } from "../types/components";

interface DgaContentSwitcherPanel extends Components.DgaContentSwitcherPanel, HTMLElement {}
export const DgaContentSwitcherPanel: {
    prototype: DgaContentSwitcherPanel;
    new (): DgaContentSwitcherPanel;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
