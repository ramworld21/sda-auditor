import type { Components, JSX } from "../types/components";

interface MonthNavigator extends Components.MonthNavigator, HTMLElement {}
export const MonthNavigator: {
    prototype: MonthNavigator;
    new (): MonthNavigator;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
