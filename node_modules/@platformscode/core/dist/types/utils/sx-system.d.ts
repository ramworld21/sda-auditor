/**
 * Types for the sx styling system, inspired by Material-UI
 */
type CSSProperties = {
    [key: string]: string | number | CSSProperties;
};
type NestedSelector = {
    [selector: string]: CSSProperties;
};
/**
 * SxProps type definition that supports:
 * 1. Direct style properties (e.g., backgroundColor: 'red')
 * 2. Nested selectors (e.g., '& .class-name': { color: 'blue' })
 * 3. Pseudo-classes (e.g., ':hover': { transform: 'scale(1.1)' })
 */
export type SxProps = CSSProperties & NestedSelector;
export {};
