export declare class DgaProgressIndicatorStep {
    el: HTMLElement;
    private progressKey;
    currentStep: number;
    title: string;
    description: string;
    nextStep: boolean;
    showStepName: boolean;
    showStepDescription: boolean;
    labelStyle: 'dot' | 'circle';
    internalActiveStep: number;
    isActive: boolean;
    labelState: 'current' | 'completed' | 'upcoming';
    private stepContentRef;
    componentWillLoad(): void;
    disconnectedCallback(): void;
    stepChangeHandler(event: CustomEvent<{
        step: number;
        progressKey: string;
    }>): void;
    private updateState;
    private handleFocus;
    private handleFocusOut;
    private handleEscape;
    private labelChildren;
    render(): any;
}
