import { SxStyleManager } from "./sx-style-manager";
/**
 * A utility class that handles sx styling for Stencil components
 */
export class SxHandler {
    /**
     * Create a new SxHandler instance
     * @param el The host element reference
     * @param idPrefix Optional prefix for the component ID
     */
    constructor(el, idPrefix = 'dga-component') {
        this.rootStyles = {};
        this.prevSx = null;
        this.el = el;
        this.componentId = `${idPrefix}-${Math.random().toString(36).substring(2, 9)}`;
        this.sxStyleManager = new SxStyleManager(this.componentId, this.el);
    }
    /**
     * Process the sx prop and generate styles
     * @param sx The sx prop value
     * @returns The processed styles object
     */
    processSx(sx) {
        if (!sx)
            return this.rootStyles;
        // Skip processing if value hasn't changed
        if (sx === this.prevSx)
            return this.rootStyles;
        // Handle both string and object formats
        const sxValue = typeof sx === 'string' ? JSON.parse(sx) : sx;
        // Process the sx prop and update rootStyles
        this.rootStyles = this.sxStyleManager.processSxProp(sxValue);
        this.prevSx = sx;
        return this.rootStyles;
    }
    /**
     * Clean up styles when component is removed
     */
    cleanup() {
        var _a;
        (_a = this.sxStyleManager) === null || _a === void 0 ? void 0 : _a.cleanup();
    }
    /**
     * Get the component ID used for styling
     * @returns The component ID
     */
    getId() {
        return this.componentId;
    }
    /**
     * Get the processed styles object
     * @returns The styles object
     */
    getStyles() {
        return this.rootStyles;
    }
}
