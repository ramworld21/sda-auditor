export interface Item {
    label: string;
    level: "one" | "two";
}
export declare class DgaList {
    type: 'ordered' | 'unordered' | 'with-icon';
    color: 'primary' | 'neutral' | 'on-color';
    title: string;
    items: string[];
    renderIcon: (type: any) => any;
    render(): any;
}
