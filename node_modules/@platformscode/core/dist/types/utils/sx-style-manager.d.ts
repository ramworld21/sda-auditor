/**
 * SxStyleManager - A utility for handling MUI-style sx props in Stencil components with Shadow DOM
 */
export type SxProps = Record<string, any>;
export declare class SxStyleManager {
    private id;
    private el;
    private styleElement;
    /**
     * Constructor for the SxStyleManager
     * @param id - Component ID for reference
     * @param el - Reference to the host element of the component
     */
    constructor(id: string, el: HTMLElement);
    /**
     * Process the sx prop and return inline styles for the root element
     * while also injecting nested styles into the Shadow DOM
     * @param sx - The sx prop object
     * @returns Record of styles for direct application to the host element
     */
    processSxProp(sx: SxProps): Record<string, any>;
    /**
     * Generate and inject styles into the Shadow DOM
     * @param sx - The sx prop object
     */
    private injectShadowStyles;
    /**
     * Convert an sx object to a CSS string for injection into Shadow DOM
     * @param sx - The sx prop object
     * @returns CSS string for injection
     */
    generateShadowStyles(sx: SxProps): string;
    private generateNestedSelectorStyles;
    private resolveSelector;
    /**
     * Convert a style object to a CSS string
     * @param styleObj - Object containing style properties
     * @returns CSS string
     */
    private styleObjectToCss;
    /**
     * Clean up any resources created by this manager
     */
    cleanup(): void;
}
