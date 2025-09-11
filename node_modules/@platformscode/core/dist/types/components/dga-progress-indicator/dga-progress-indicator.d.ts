import { EventEmitter } from '../../stencil-public-runtime';
export declare class DgaProgressIndicator {
    activeStep?: number;
    alignment?: 'horizontal' | 'vertical';
    progressKey?: string;
    internalActiveStep: number;
    el: HTMLElement;
    stepChange: EventEmitter<{
        step: number;
        progressKey: string;
    }>;
    private componentKey;
    componentWillLoad(): void;
    updateInternalActiveStep(): void;
    componentDidLoad(): void;
    render(): any;
}
