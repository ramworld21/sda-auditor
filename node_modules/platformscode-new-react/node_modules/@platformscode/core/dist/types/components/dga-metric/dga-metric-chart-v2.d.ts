export interface DataPoint {
    x: number;
    y: number;
}
export interface MarkerPosition {
    x: number;
    y: number;
}
export declare class DgaMetricChartV2 {
    width: number;
    height: number;
    strokeColor: string;
    fillColor: string;
    strokeWidth: number;
    data: DataPoint[];
    showMarker: boolean;
    markerPosition?: MarkerPosition;
    private pathD;
    private areaD;
    private currentMarkerPos;
    dataChangeHandler(): void;
    componentWillLoad(): void;
    private normalizeData;
    private updateMarkerPosition;
    private generatePaths;
    render(): any;
}
