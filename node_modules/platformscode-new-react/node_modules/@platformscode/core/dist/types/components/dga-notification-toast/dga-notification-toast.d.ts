export declare class DgaNotificationToast {
    type?: 'error' | 'warning' | 'success' | 'info' | 'neutral';
    leadText?: string;
    hasHelperText?: boolean;
    helperText?: string;
    action?: boolean;
    closeButton?: boolean;
    vPostion?: 'top' | 'bottom';
    hPostion?: 'left' | 'right';
    onClose?: (event: any) => void;
    buttonsList?: {
        id?: string;
        label: string;
        onClick: (event?: any) => void;
        extraClasses?: string;
        title?: string;
    }[];
    open?: boolean;
    private icons;
    render(): any;
}
