export declare class DgaMetricChart {
    type?: 'realistic' | 'wavy' | 'straight' | 'layers';
    trend: 'positive' | 'negative';
    size?: 'sm' | 'lg';
    showMarker: boolean;
    data: number[];
    lineColor: string;
    fillColor: string;
    width: number;
    height: number;
    handleSizeChange(): void;
    private getLinePath;
    private getPoints;
    private getSmoothPath;
    private getWavyPath;
    private getStraightPath;
    private getAreaPath;
    render(): any;
}
