export declare class DgaSlideoutMenu {
    backgroundColor?: 'gray' | 'white';
    anchor?: 'left' | 'right';
    open?: boolean;
    scrollbar?: boolean;
    onClose?: () => void;
    el: HTMLElement;
    componentWillLoad(): void;
    disconnectedCallback(): void;
    render(): any;
}
