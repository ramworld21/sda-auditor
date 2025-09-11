/**
 * SxStyleManager - A utility for handling MUI-style sx props in Stencil components with Shadow DOM
 */
// Define the SxProps type (flexible to handle MUI-style props)
const BREAKPOINTS = {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
};
export class SxStyleManager {
    /**
     * Constructor for the SxStyleManager
     * @param id - Component ID for reference
     * @param el - Reference to the host element of the component
     */
    constructor(id, el) {
        this.styleElement = null;
        this.id = id;
        this.el = el;
    }
    /**
     * Process the sx prop and return inline styles for the root element
     * while also injecting nested styles into the Shadow DOM
     * @param sx - The sx prop object
     * @returns Record of styles for direct application to the host element
     */
    processSxProp(sx) {
        if (!sx)
            return {};
        // Extract root styles (both direct properties and from '&' selector)
        const rootStyles = {};
        // Process direct styles (MUI style)
        for (const key in sx) {
            if (typeof sx[key] !== 'object' && !key.startsWith('&') && !key.startsWith(':')) {
                // Direct style like backgroundColor: 'yellow'
                rootStyles[key] = sx[key];
            }
        }
        // Also check for root styles in nested '&' selector (Stencil style)
        if (sx['&'] && typeof sx['&'] === 'object') {
            Object.assign(rootStyles, sx['&']);
        }
        // Generate and inject shadow styles for nested selectors
        this.injectShadowStyles(sx);
        console.log('rootStyles', rootStyles);
        return rootStyles;
    }
    /**
     * Generate and inject styles into the Shadow DOM
     * @param sx - The sx prop object
     */
    injectShadowStyles(sx) {
        // Generate CSS text
        const cssText = this.generateShadowStyles(sx);
        // Nothing to inject if no CSS was generated
        if (!cssText)
            return;
        // Get the shadow root directly from the element
        const shadowRoot = this.el.shadowRoot;
        if (!shadowRoot) {
            console.warn(`Shadow root not found for element with ID ${this.id}`);
            return;
        }
        // Create or update style element
        if (!this.styleElement) {
            this.styleElement = document.createElement('style');
            this.styleElement.id = `${this.id}-sx-styles`;
            shadowRoot.appendChild(this.styleElement);
        }
        this.styleElement.textContent = cssText;
    }
    /**
     * Convert an sx object to a CSS string for injection into Shadow DOM
     * @param sx - The sx prop object
     * @returns CSS string for injection
     */
    generateShadowStyles(sx) {
        let cssText = '';
        const baseStyles = {};
        const mediaQueries = {};
        for (const key in sx) {
            const value = sx[key];
            if (typeof value === 'object' && !key.startsWith('&') && !key.startsWith(':')) {
                // Breakpoint-specific values
                for (const bp in value) {
                    if (BREAKPOINTS[bp] !== undefined) {
                        if (!mediaQueries[bp])
                            mediaQueries[bp] = {};
                        mediaQueries[bp][key] = value[bp];
                    }
                }
            }
            else if (!key.startsWith('&') && !key.startsWith(':')) {
                baseStyles[key] = value;
            }
        }
        // Root styles
        if (Object.keys(baseStyles).length > 0) {
            cssText += `:host { ${this.styleObjectToCss(baseStyles)} }\n`;
        }
        // Media queries
        for (const bp in mediaQueries) {
            const minWidth = BREAKPOINTS[bp];
            const styles = this.styleObjectToCss(mediaQueries[bp]);
            cssText += `@media (min-width: ${minWidth}px) { :host { ${styles} } }\n`;
        }
        // Nested selectors (keep original logic)
        for (const key in sx) {
            if (key.startsWith('&') || key.startsWith(':') || typeof sx[key] === 'object') {
                // Handle nested selectors
                cssText += this.generateNestedSelectorStyles(key, sx[key]);
            }
        }
        return cssText;
    }
    generateNestedSelectorStyles(selector, styleObj) {
        if (!styleObj || typeof styleObj !== 'object')
            return '';
        let cssText = '';
        const baseStyles = {};
        const mediaStyles = {};
        for (const key in styleObj) {
            const value = styleObj[key];
            if (typeof value === 'object') {
                for (const bp in value) {
                    if (BREAKPOINTS[bp] !== undefined) {
                        if (!mediaStyles[bp])
                            mediaStyles[bp] = {};
                        mediaStyles[bp][key] = value[bp];
                    }
                }
            }
            else {
                baseStyles[key] = value;
            }
        }
        const cssSelector = this.resolveSelector(selector);
        if (Object.keys(baseStyles).length > 0) {
            cssText += `${cssSelector} { ${this.styleObjectToCss(baseStyles)} }\n`;
        }
        for (const bp in mediaStyles) {
            const minWidth = BREAKPOINTS[bp];
            const styles = this.styleObjectToCss(mediaStyles[bp]);
            cssText += `@media (min-width: ${minWidth}px) { ${cssSelector} { ${styles} } }\n`;
        }
        return cssText;
    }
    resolveSelector(selector) {
        if (selector === '&')
            return ':host';
        if (selector.startsWith('&:'))
            return `:host${selector.slice(1)}`;
        if (selector.startsWith('&.'))
            return `:host${selector.slice(1)}`;
        if (selector.startsWith('& '))
            return `:host ${selector.slice(2)}`;
        if (selector.startsWith(':'))
            return `:host${selector}`;
        return `:host ${selector}`;
    }
    /**
     * Convert a style object to a CSS string
     * @param styleObj - Object containing style properties
     * @returns CSS string
     */
    styleObjectToCss(styleObj) {
        if (!styleObj || typeof styleObj !== 'object')
            return '';
        return Object.entries(styleObj)
            .map(([prop, value]) => {
            // Convert camelCase to kebab-case
            const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${kebabProp}: ${value};`;
        })
            .join(' ');
    }
    /**
     * Clean up any resources created by this manager
     */
    cleanup() {
        if (this.styleElement && this.el.shadowRoot) {
            try {
                this.el.shadowRoot.removeChild(this.styleElement);
                this.styleElement = null;
            }
            catch (e) {
                console.warn('Error cleaning up styles:', e);
            }
        }
    }
}
