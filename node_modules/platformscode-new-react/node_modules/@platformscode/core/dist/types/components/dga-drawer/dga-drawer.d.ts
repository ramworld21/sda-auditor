import { Icon } from '../dga-avatar/dga-avatar';
import { SxProps } from '../../utils/sx-handler';
export interface IRoute {
    name: string;
    path: string;
    badge?: number;
    level?: number;
    icon?: Icon;
    disabled?: boolean;
    children?: Array<IRoute>;
}
export declare class DgaDrawer {
    el: HTMLElement;
    background?: 'gray' | 'brand';
    overlay?: boolean;
    border?: boolean;
    anchor?: 'left' | 'right';
    open?: boolean;
    routes: IRoute[];
    headerLogo?: string;
    sx?: SxProps | string;
    private sxHandler;
    componentWillLoad(): void;
    componentDidLoad(): void;
    sxChanged(): void;
    disconnectedCallback(): void;
    render(): any;
}
