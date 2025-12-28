export declare class DgaInlineAlert {
    type: 'neutral' | 'info' | 'error' | 'success' | 'warning';
    leadText: string;
    helperText?: string;
    isactionButtons: boolean;
    isCloseButton: boolean;
    onClose?: (event: any) => void;
    colored: boolean;
    buttonsList: {
        id?: string;
        label: string;
        onClick: (event?: any) => void;
        exraClasses?: string;
        title?: string;
    }[];
    private icons;
    render(): any;
}
