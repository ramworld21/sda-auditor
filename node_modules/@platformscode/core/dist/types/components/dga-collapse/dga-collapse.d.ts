export declare class DgaCollapse {
    private containerRef;
    open: boolean;
    customStyle?: {
        [key: string]: string;
    };
    transitionDuration: string;
    transitionType: string;
    height: number | string;
    componentDidLoad(): void;
    watchOpen(newValue: boolean, oldValue: boolean): void;
    private setHeight;
    render(): any;
}
