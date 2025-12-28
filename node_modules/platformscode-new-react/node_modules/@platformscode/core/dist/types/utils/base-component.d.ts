export declare class BaseComponent {
    el: HTMLElement;
    /**
     * Check if the component is in RTL mode
     * This checks the computed direction which handles all inheritance
     */
    protected isRTL(): boolean;
    /**
     * Get the current text direction
     */
    protected getDirection(): 'ltr' | 'rtl';
    /**
     * Get directional value (useful for calculations)
     * Returns 1 for LTR, -1 for RTL
     */
    protected getDirectionMultiplier(): number;
}
