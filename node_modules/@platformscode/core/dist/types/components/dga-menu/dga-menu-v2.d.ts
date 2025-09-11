export declare class DgaMenuV2 {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    anchorOrigin: {
        vertical: 'top' | 'bottom';
        horizontal: 'left' | 'right';
    };
    transformOrigin: {
        vertical: number;
        horizontal: number;
    };
    menuStyle: {
        [key: string]: string;
    };
    handleOpenChange(newValue: boolean): void;
    private handleClickOutside;
    private calculateMenuStyle;
    render(): any;
}
