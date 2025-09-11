/**
 * RTL Detection and Utility Functions
 * Use these functions across all your Stencil components
 */
/**
 * Check if an element is in RTL mode
 * This checks the computed direction which handles all inheritance
 */
export declare function isElementRTL(element: HTMLElement): boolean;
/**
 * Get the current text direction of an element
 */
export declare function getElementDirection(element: HTMLElement): 'ltr' | 'rtl';
/**
 * Get directional value (useful for calculations)
 * Returns 1 for LTR, -1 for RTL
 */
export declare function getDirectionMultiplier(element: HTMLElement): number;
/**
 * Get CSS positioning properties for RTL
 */
export declare function getRTLPositioning(element: HTMLElement): {
    isRTL: boolean;
    start: string;
    end: string;
    startValue: (value: string) => {
        [x: string]: string;
    };
    endValue: (value: string) => {
        [x: string]: string;
    };
};
/**
 * Reverse a percentage for RTL calculations
 */
export declare function reversePercentForRTL(percent: number, element: HTMLElement): number;
/**
 * Initialize RTL support for a component
 */
export declare function initializeRTLSupport(element: HTMLElement): void;
/**
 * Get the appropriate arrow icon for RTL/LTR
 */
export declare function getDirectionalArrowIcon(element: HTMLElement, rightIcon?: string, leftIcon?: string): string;
/**
 * Get comprehensive RTL information (useful for debugging)
 */
export declare function getRTLInfo(element: HTMLElement): {
    isRTL: boolean;
    computedDirection: string;
    hierarchy: {
        tag: string;
        dir: string | null;
        computed: string;
    }[];
};
