import { Icon } from '../dga-featured-icon/dga-featured-icon';
export declare class DgaModal {
    modalTitle?: string;
    closeButton?: boolean;
    onClose?: (event: any) => void;
    featuredIconProps?: {
        size: 'sm' | 'md' | 'lg' | 'xl';
        color: 'brand' | 'gray' | 'error' | 'warning' | 'success' | 'info';
        variant: 'light' | 'dark' | 'outlined';
        circle?: boolean;
        icon: Icon;
    };
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
    dialogRef: HTMLDialogElement;
    containergRef: HTMLDivElement;
    private handleClickOutside;
    render(): any;
}
