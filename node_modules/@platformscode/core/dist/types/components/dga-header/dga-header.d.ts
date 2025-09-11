export interface IHeaderConfig {
    fullWidth: boolean;
    divider: boolean;
    subMenuBackground: string;
    subMenuFullWidth: boolean;
    logoSrc: string;
    govSrc?: string;
    logoLink: string;
    govLink?: string;
    headerLinks: {
        label: string;
        icon: string;
        subMenu: {
            columns: {
                background: string;
                links: {
                    label: string;
                    helperText?: string;
                    icon: string;
                    linkStyle: number;
                }[];
            }[];
        }[];
    }[];
    actions: {
        label: string;
        icon: string;
    }[];
}
export declare class DgaHeader {
    config: IHeaderConfig;
    render(): any;
}
