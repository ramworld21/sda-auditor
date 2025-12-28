export declare class DgaModal {
    modalTitle?: string;
    showCloseButton?: boolean;
    onClose?: (event: any) => void;
    featuredIconColor?: 'brand' | 'gray' | 'error' | 'warning' | 'success' | 'info';
    featuredIconStyle?: 'light' | 'outlined' | 'dark';
    featuredIconType?: 'InformationCircle' | 'AlertCircle';
    featuredIconCircle?: boolean;
    featuredIconSize?: 'xl' | 'lg' | 'md' | 'sm';
    alignmentCenter?: boolean;
    actionFillContainer?: boolean;
    actionStack?: boolean;
    secondBtnPosition?: 'left' | 'right';
    position?: 'start' | 'end' | 'center';
    name: string;
    open?: boolean;
    staticModal?: boolean;
    buttonsList?: Array<{
        id?: string;
        label: string;
        onClick: (event?: any) => void;
        extraClass?: string;
        title?: string;
    }>;
    el: HTMLElement;
    dialogRef: HTMLDialogElement;
    containergRef: HTMLDivElement;
    private handleClickOutside;
    componentWillLoad(): void;
    render(): any;
}
