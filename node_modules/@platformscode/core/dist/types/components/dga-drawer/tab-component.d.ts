import { IRoute } from './dga-drawer';
export declare class TabComponent {
    route: IRoute;
    isExpanded: boolean;
    submenuElement: HTMLUListElement;
    handleExpanded(expanded: boolean): void;
    render(): any;
}
