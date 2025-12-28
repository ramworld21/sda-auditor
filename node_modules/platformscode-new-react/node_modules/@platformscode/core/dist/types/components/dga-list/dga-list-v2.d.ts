interface BaseItem {
    label: string;
    level: "one" | "two";
}
interface OrderedItem extends BaseItem {
    type: 'ordered';
    itemNumber?: string;
    itemLetter?: string;
}
interface UnorderedItem extends BaseItem {
    type: 'unordered';
}
interface WithIconItem extends BaseItem {
    type: 'with-icon';
    icon: string;
}
export type ListItem = OrderedItem | UnorderedItem | WithIconItem;
export declare class DgaListV2 {
    type: 'ordered' | 'unordered' | 'with-icon';
    color: 'primary' | 'neutral' | 'on-color';
    title: string;
    items: ListItem[];
    render(): any;
}
export {};
