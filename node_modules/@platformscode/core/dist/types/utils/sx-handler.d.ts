import * as CSS from 'csstype';
export interface SxProps extends CSS.Properties<string | number> {
    [key: string]: string | number | CSS.Properties<string | number> | undefined;
}
/**
 * A utility class that handles sx styling for Stencil components
 */
export declare class SxHandler {
    private componentId;
    private sxStyleManager;
    private rootStyles;
    private prevSx;
    private el;
    /**
     * Create a new SxHandler instance
     * @param el The host element reference
     * @param idPrefix Optional prefix for the component ID
     */
    constructor(el: HTMLElement, idPrefix?: string);
    /**
     * Process the sx prop and generate styles
     * @param sx The sx prop value
     * @returns The processed styles object
     */
    processSx(sx: SxProps | string | undefined): Record<string, any>;
    /**
     * Clean up styles when component is removed
     */
    cleanup(): void;
    /**
     * Get the component ID used for styling
     * @returns The component ID
     */
    getId(): string;
    /**
     * Get the processed styles object
     * @returns The styles object
     */
    getStyles(): Record<string, any>;
}
