import { IRoute } from './dga-drawer';
export declare class SubmenuComponent {
    route: IRoute;
    childRoute: IRoute;
    onChildExpanded?: (expanded: boolean, subHeight: number) => void;
    submenuElement: HTMLUListElement;
    handleExpanded(expanded: boolean): void;
    render(): any;
}
