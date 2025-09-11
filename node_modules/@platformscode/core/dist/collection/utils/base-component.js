var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Element } from "@stencil/core";
export class BaseComponent {
    /**
     * Check if the component is in RTL mode
     * This checks the computed direction which handles all inheritance
     */
    isRTL() {
        if (!this.el)
            return false;
        const computedStyle = getComputedStyle(this.el);
        return computedStyle.direction === 'rtl';
    }
    /**
     * Get the current text direction
     */
    getDirection() {
        return this.isRTL() ? 'rtl' : 'ltr';
    }
    /**
     * Get directional value (useful for calculations)
     * Returns 1 for LTR, -1 for RTL
     */
    getDirectionMultiplier() {
        return this.isRTL() ? -1 : 1;
    }
}
__decorate([
    Element()
], BaseComponent.prototype, "el", void 0);
