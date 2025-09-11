/**
 * Decorator that adds sx styling capabilities to a Stencil component
 * To use this decorator, add it before the @Component decorator
 *
 * @example
 * ```
 * @WithSx('dga-button')
 * @Component({
 *   tag: 'dga-button',
 *   styleUrl: 'dga-button.scss',
 *   shadow: true,
 * })
 * export class DgaButton {
 *   @Prop() sx?: SxProps | string;
 *   // ... rest of component
 * }
 * ```
 */
export function WithSx(idPrefix) {
    return function (componentClass) {
        // Store the original lifecycle methods
        const originalWillLoad = componentClass.prototype.componentWillLoad;
        const originalDidLoad = componentClass.prototype.componentDidLoad;
        const originalDidUpdate = componentClass.prototype.componentDidUpdate;
        const originalDisconnected = componentClass.prototype.disconnectedCallback;
        // Replace componentWillLoad
        componentClass.prototype.componentWillLoad = function () {
            // Initialize the SxHandler
            this._sxHandler = new SxHandler(this.el, idPrefix);
            // Call original if it exists
            if (originalWillLoad) {
                return originalWillLoad.call(this);
            }
        };
        // Replace componentDidLoad
        componentClass.prototype.componentDidLoad = function () {
            // Process initial styling
            if (this.sx) {
                this._sxHandler.processSx(this.sx);
            }
            // Call original if it exists
            if (originalDidLoad) {
                originalDidLoad.call(this);
            }
        };
        // Replace componentDidUpdate
        componentClass.prototype.componentDidUpdate = function () {
            // Process styling on update
            if (this.sx) {
                this._sxHandler.processSx(this.sx);
            }
            // Call original if it exists
            if (originalDidUpdate) {
                originalDidUpdate.call(this);
            }
        };
        // Replace disconnectedCallback
        componentClass.prototype.disconnectedCallback = function () {
            // Clean up
            if (this._sxHandler) {
                this._sxHandler.cleanup();
            }
            // Call original if it exists
            if (originalDisconnected) {
                originalDisconnected.call(this);
            }
        };
        // Add convenience methods
        componentClass.prototype.getSxId = function () {
            return this._sxHandler ? this._sxHandler.getId() : '';
        };
        componentClass.prototype.getSxStyles = function () {
            return this._sxHandler ? this._sxHandler.getStyles() : {};
        };
        // Add Watch for sx prop
        const originalWatchCallback = componentClass.prototype.sxChanged;
        componentClass.prototype.sxChanged = function (newValue) {
            if (this._sxHandler) {
                this._sxHandler.processSx(newValue);
            }
            // Call original if it exists
            if (originalWatchCallback) {
                originalWatchCallback.call(this, newValue);
            }
        };
        return componentClass;
    };
}
// Import for TypeScript intellisense
import { SxHandler } from "./sx-handler";
