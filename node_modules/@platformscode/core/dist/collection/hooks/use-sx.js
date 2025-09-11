import { SxStyleManager } from "../utils/sx-style-manager";
export class SxHook {
    constructor(componentName, element) {
        this.rootStyles = {};
        this.componentId = `${componentName}-${Math.random().toString(36).substring(2, 9)}`;
        this.sxStyleManager = new SxStyleManager(this.componentId, element);
    }
    processSx(sx) {
        if (!sx)
            return { componentId: this.componentId, rootStyles: {} };
        const sxValue = typeof sx === 'string' ? JSON.parse(sx) : sx;
        this.rootStyles = this.sxStyleManager.processSxProp(sxValue);
        return {
            componentId: this.componentId,
            rootStyles: this.rootStyles,
        };
    }
    cleanup() {
        var _a;
        (_a = this.sxStyleManager) === null || _a === void 0 ? void 0 : _a.cleanup();
    }
}
