export interface BaseItemProps {
    type: 'ordered' | 'unordered' | 'with-icon';
    level: 'one' | 'two';
    itemText: string;
}
export interface OrderedItemProps extends BaseItemProps {
    type: 'ordered';
    itemNumber?: string;
    itemLetter?: string;
}
export interface UnorderedItemProps extends BaseItemProps {
    type: 'unordered';
}
export interface WithIconItemProps extends BaseItemProps {
    type: 'with-icon';
    icon: string;
}
export type ListItemProps = OrderedItemProps | UnorderedItemProps | WithIconItemProps;
export declare class DgaListItem {
    type: ListItemProps['type'];
    level: ListItemProps['level'];
    itemText: string;
    itemNumber?: string;
    itemLetter?: string;
    icon?: string;
    inheritedType: BaseItemProps['type'] | undefined;
    el: HTMLElement;
    componentWillLoad(): void;
    private getListClass;
    private renderMarker;
    render(): any;
}
