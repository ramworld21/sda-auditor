import { SxProps } from '../utils/sx-style-manager';
export declare class SxHook {
    private componentId;
    private sxStyleManager;
    private rootStyles;
    constructor(componentName: string, element: HTMLElement);
    processSx(sx?: SxProps | string): {
        componentId: string;
        rootStyles: Record<string, any>;
    };
    cleanup(): void;
}
