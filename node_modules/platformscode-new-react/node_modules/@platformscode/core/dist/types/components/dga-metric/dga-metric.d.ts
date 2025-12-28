export interface ITrend {
    slope: 'negative' | 'positive';
    description: string;
    value: string;
}
export interface IChartProps {
    type?: 'realistic' | 'wavy' | 'straight' | 'layers';
    trend: 'positive' | 'negative';
    showMarker: boolean;
    data: number[];
}
export declare class DgaMetric {
    label: string;
    Style?: 'small-chart' | 'large-chart';
    percentage: string;
    showFeaturedIcon?: boolean;
    featuredIcon?: HTMLElement | any;
    showChart?: boolean;
    showInfo?: boolean;
    showActions?: boolean;
    showSecondaryAction?: boolean;
    showMoreButton?: boolean;
    changeProps?: {
        type: '01' | '02';
        trend: 'positive' | 'negative';
    };
    chartProps?: IChartProps;
    trend: ITrend;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    onExpandAction?: () => void;
    changeIcons: {
        '01': {
            positive: string;
            negative: string;
        };
        '02': {
            positive: string;
            negative: string;
        };
    };
    render(): any;
}
