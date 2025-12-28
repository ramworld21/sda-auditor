import * as CSS from 'csstype';
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
export type SxProps = {
    [K in keyof CSS.Properties<string | number>]?: ResponsiveValue<CSS.Properties<string | number>[K]>;
} & {
    [key: string]: string | number | CSS.Properties<string | number> | SxProps | undefined;
};
export {};
