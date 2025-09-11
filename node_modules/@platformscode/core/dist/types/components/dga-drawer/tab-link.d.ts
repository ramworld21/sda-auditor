import { Icon } from '../dga-avatar/dga-avatar';
export declare class TabLink {
    type: 'parent' | 'child';
    onColor: boolean;
    level: number;
    badge?: number;
    icon?: Icon;
    externalLink: boolean;
    text: string;
    link: string;
    expanded: boolean;
    onExpand?: (value: boolean) => void;
    disabled: boolean;
    isExpanded: boolean;
    tabRef: HTMLAnchorElement;
    private toggleTab;
    private handleMouseEvents;
    render(): any;
}
