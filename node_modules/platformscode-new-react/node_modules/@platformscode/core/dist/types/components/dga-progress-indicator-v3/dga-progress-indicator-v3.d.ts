import { EventEmitter } from '../../stencil-public-runtime';
export declare class DgaProgressIndicator {
    activeStep?: number;
    alignment?: 'horizontal' | 'vertical';
    internalActiveStep: number;
    el: HTMLElement;
    stepChange: EventEmitter<number>;
    private updateSlottedElements;
    updateInternalActiveStep(): void;
    componentDidLoad(): void;
    componentWillLoad(): void;
    render(): any;
}
