export declare class DgaDigitalSignature {
    language?: 'ar' | 'en';
    opened?: boolean;
    extension?: '.gov.sa' | '.edu.sa' | '.med.sa' | '.org.sa' | '.sch.sa' | '.sa';
    isOpen: boolean;
    linkProps?: {
        variant: 'primary' | 'neutral' | 'on-color';
        size: 'sm' | 'md' | 'lg';
        label: string;
        url: string;
        inline?: boolean;
        icon?: boolean;
        iconType?: any;
        disabled?: boolean;
        external?: boolean;
        target?: '_blank' | '_self' | '_parent' | '_top';
    };
    watchOpened(newVal: boolean): void;
    private get data();
    componentWillLoad(): void;
    toggleOpen: () => void;
    render(): any;
}
