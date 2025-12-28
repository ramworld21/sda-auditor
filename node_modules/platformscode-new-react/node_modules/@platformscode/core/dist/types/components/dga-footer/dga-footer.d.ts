import { Icon } from '../dga-featured-icon/dga-featured-icon';
export interface FooterType {
    background?: 'DarkGreen' | 'Light';
    NavLinks?: boolean;
    mainTitle?: string;
    mainDescription?: string;
    mainLinkTilte?: string;
    mainLink?: string;
    mainImage?: string;
    groupLinks?: {
        title: string;
        links: {
            name: string;
            target: string;
        }[];
    }[];
    socialMediaTitle: string;
    socialMediaLinks: {
        title?: string;
        target: string;
        icon: Icon;
    }[];
    accessibilityTitle?: string;
    accessibilityLinks?: {
        title?: string;
        target: string;
        icon: Icon;
    }[];
    basicLinks?: {
        name: string;
        target: string;
    }[];
    extraLinks?: {
        name: string;
        target: string;
    }[];
    copyright?: string;
    bottomImages?: string[];
}
export declare class DgaFooter {
    background?: 'DarkGreen' | 'Light';
    NavLinks?: boolean;
    mainTitle: string;
    mainDescription: string;
    mainLink?: string;
    mainLinkTilte: string;
    mainImage: string;
    copyright: string;
    groupLinks: {
        title: string;
        links: {
            name: string;
            target: string;
        }[];
    }[];
    socialMediaTitle: string;
    socialMediaLinks: {
        title?: string;
        target: string;
        icon: Icon;
    }[];
    accessibilityTitle: string;
    accessibilityLinks: {
        title?: string;
        target: string;
        icon: Icon;
    }[];
    basicLinks: {
        name: string;
        target: string;
    }[];
    extraLinks: {
        name: string;
        target: string;
    }[];
    bottomImages: string[];
    render(): any;
}
