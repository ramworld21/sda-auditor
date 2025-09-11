export declare class DgaContentSwitcher {
    value?: number;
    onColor: boolean;
    size: 'sm' | 'md' | 'lg';
    items: {
        label: any;
        content: any;
    }[];
    onChange?: (value: number) => void;
    selected: number;
    private handleSelect;
    render(): any;
}
