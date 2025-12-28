/**
 * RTL Detection and Utility Functions
 * Use these functions across all your Stencil components
 */
/**
 * Check if an element is in RTL mode
 * This checks the computed direction which handles all inheritance
 */
export function isElementRTL(element) {
    if (!element)
        return false;
    const computedStyle = getComputedStyle(element);
    return computedStyle.direction === 'rtl';
}
/**
 * Get the current text direction of an element
 */
export function getElementDirection(element) {
    return isElementRTL(element) ? 'rtl' : 'ltr';
}
/**
 * Get directional value (useful for calculations)
 * Returns 1 for LTR, -1 for RTL
 */
export function getDirectionMultiplier(element) {
    return isElementRTL(element) ? -1 : 1;
}
/**
 * Get CSS positioning properties for RTL
 */
export function getRTLPositioning(element) {
    const isRTL = isElementRTL(element);
    return {
        isRTL,
        start: isRTL ? 'right' : 'left',
        end: isRTL ? 'left' : 'right',
        startValue: (value) => ({ [isRTL ? 'right' : 'left']: value }),
        endValue: (value) => ({ [isRTL ? 'left' : 'right']: value }),
    };
}
/**
 * Reverse a percentage for RTL calculations
 */
export function reversePercentForRTL(percent, element) {
    return isElementRTL(element) ? 1 - percent : percent;
}
/**
 * Initialize RTL support for a component
 */
export function initializeRTLSupport(element) {
    console.log('RTL support initialized for', element.tagName);
    // Any global RTL setup can go here
    // Optional: Add RTL class to element
    if (isElementRTL(element)) {
        element.classList.add('rtl-enabled');
    }
}
/**
 * Get the appropriate arrow icon for RTL/LTR
 */
export function getDirectionalArrowIcon(element, rightIcon = 'ArrowRight01Icon', leftIcon = 'ArrowLeft01Icon') {
    const isRTL = isElementRTL(element);
    return isRTL ? leftIcon : rightIcon;
}
/**
 * Get comprehensive RTL information (useful for debugging)
 */
export function getRTLInfo(element) {
    const computedStyle = getComputedStyle(element);
    let currentElement = element;
    const hierarchy = [];
    // Build hierarchy info
    while (currentElement) {
        hierarchy.push({
            tag: currentElement.tagName.toLowerCase(),
            dir: currentElement.getAttribute('dir'),
            computed: getComputedStyle(currentElement).direction,
        });
        currentElement = currentElement.parentElement;
    }
    return {
        isRTL: computedStyle.direction === 'rtl',
        computedDirection: computedStyle.direction,
        hierarchy,
    };
}
