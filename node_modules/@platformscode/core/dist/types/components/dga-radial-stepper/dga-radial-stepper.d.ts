export interface Step {
    text?: string;
    stepName: string;
    stepDescription: string;
    showPreStep: boolean;
    showNextStep: boolean;
}
export declare class DgaRadialStepper {
    RTL: boolean;
    size: '120px' | '80px' | '64px' | '48px' | '40px';
    showText: boolean;
    steps: Step[];
    activeStep: number;
    variant?: 'primary' | 'neutral' | 'on-color';
    showStepName: boolean;
    showStepDescription: boolean;
    internalPercentage: number;
    internalActiveStep: number;
    updateInternalPercentage(): void;
    componentDidLoad(): void;
    private sizes;
    render(): any;
}
