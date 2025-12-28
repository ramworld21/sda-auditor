import ApexCharts, { ApexOptions } from "apexcharts";
export type ApexChartType = ApexChart['type'];
export type ApexChartWidth = ApexChart['width'];
export type ApexChartHeight = ApexChart['height'];
export type ApexOptionsSeries = ApexOptions['series'];
export type ApexOptionsLabels = ApexOptions['labels'];
export type ApexOptionsXaxis = ApexOptions['xaxis'];
export type ApexOptionsYaxis = ApexOptions['yaxis'];
export declare class DgaChart {
    chartRef: HTMLElement;
    /**
     * Internal ApexCharts instance
     */
    chartObj: ApexCharts;
    /**
     * (optional) Type
     * @see https://apexcharts.com/docs/options/chart/type/
     */
    type?: ApexChartType;
    /**
     * (optional) Width
     * @see https://apexcharts.com/docs/options/chart/width/
     */
    width?: ApexChartWidth;
    /**
     * (optional) Height
     * @see https://apexcharts.com/docs/options/chart/height/
     */
    height?: ApexChartHeight;
    /**
     * (optional) Options
     * @see https://apexcharts.com/docs/options/
     */
    options?: ApexOptions;
    optionsChanged(options: ApexOptions): Promise<void>;
    /**
     * (optional) Series
     * @see https://apexcharts.com/docs/options/series/
     */
    series?: ApexOptionsSeries;
    labels?: ApexOptionsLabels;
    xaxis?: ApexOptions['xaxis'];
    yaxis?: ApexOptions['yaxis'];
    colors?: ApexOptions['colors'];
    seriesChanged(series: ApexOptionsSeries): void;
    /**
     * Updates the configuration object. The new config object is merged with the existing config object preserving the existing configuration.
     * @param newOptions The configuration object to merge on the existing one
     * @param redrawPaths When the chart is re-rendered, should it draw from the existing paths or completely redraw the chart paths from the beginning. By default, the chart is re-rendered from the existing paths
     * @param animate Should the chart animate on re-rendering
     */
    updateOptions(newOptions: ApexOptions, redrawPaths?: boolean, animate?: boolean): Promise<void>;
    componentDidLoad(): Promise<void>;
    disconnectedCallback(): void;
    render(): any;
}
