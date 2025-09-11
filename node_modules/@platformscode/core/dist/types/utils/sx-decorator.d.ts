/**
 * Decorator that adds sx styling capabilities to a Stencil component
 * To use this decorator, add it before the @Component decorator
 *
 * @example
 * ```
 * @WithSx('dga-button')
 * @Component({
 *   tag: 'dga-button',
 *   styleUrl: 'dga-button.scss',
 *   shadow: true,
 * })
 * export class DgaButton {
 *   @Prop() sx?: SxProps | string;
 *   // ... rest of component
 * }
 * ```
 */
export declare function WithSx(idPrefix: string): (componentClass: any) => any;
