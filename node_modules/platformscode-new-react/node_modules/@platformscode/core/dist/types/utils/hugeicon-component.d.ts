export type IconSvgElement = [elementName: string, attrs: Record<string, string>][];
export type IconSvgObject = IconSvgElement;
export interface HugeiconsProps {
    size?: string | number;
    color?: string;
    strokeWidth?: number;
    class?: string;
    className?: string;
}
export declare function createHugeiconRender(svgObject: IconSvgObject): (props: HugeiconsProps) => import("@stencil/core").VNode;
