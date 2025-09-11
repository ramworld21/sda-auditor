export declare class DgaHeaderActionBtn {
    el: HTMLElement;
    label?: string;
    icon?: string;
    active?: boolean;
    extraClasses?: string;
    onClick: () => void;
    subMenuBackground: 'brand' | 'white';
    subMenuFullWidth: boolean;
    openSubMenu: boolean;
    private handleClick;
    componentWillLoad(): void;
    render(): any;
}
