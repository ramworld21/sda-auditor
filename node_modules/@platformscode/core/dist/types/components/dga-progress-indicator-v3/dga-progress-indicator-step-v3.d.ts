export interface StepProps {
    index?: number;
    title?: string;
    description?: string;
    activeStep?: number;
    nextStep?: boolean;
    showStepName?: boolean;
    showStepDescription?: boolean;
}
export declare class DgaProgressIndicatorStep {
    el: HTMLElement;
    currentStep: number;
    title: string;
    description: string;
    activeStep: number;
    nextStep: boolean;
    showStepName: boolean;
    showStepDescription: boolean;
    internalActiveStep: number;
    isActive: boolean;
    labelState: 'current' | 'completed' | 'upcoming';
    labelStyle: 'dot' | 'circle';
    private stepContentRef;
    componentWillLoad(): void;
    disconnectedCallback(): void;
    stepChangeHandler(event: CustomEvent<number>): void;
    private updateState;
    private handleFocus;
    private handleFocusOut;
    private handleEscape;
    private labelChildren;
    render(): any;
}
