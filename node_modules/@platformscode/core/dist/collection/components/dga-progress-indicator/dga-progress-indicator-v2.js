// import { Component, h, Prop } from '@stencil/core';
// @Component({
//   tag: 'dga-progress-indicator-v2',
//   styleUrl: "dga-progress-indicator.scss"
// })
// export class DgaProgressIndicatorV2 {
//   @Prop() activeStep?: number = 1;
//   @Prop() alignment?: 'horizontal' | 'vertical' = 'horizontal';
//   @Prop() steps: Array<{
//     label: string;
//     description: string;
//   }> = [];
//   // @State() parsedSteps: Array<{ label: string; description: string }> = [];
//   // componentWillLoad() {
//   //   // Parse the steps string into an array
//   //   try {
//   //     console.log(this.steps);
//   //     this.parsedSteps = JSON.parse(this.steps);
//   //   } catch (error) {
//   //     console.error('Invalid steps format:', error);
//   //     this.parsedSteps = [];
//   //   }
//   // }
//   render() {
//     return (
//       <div class="progress-indicator flex" data-alignment={this.alignment}>
//         {this.steps.map((step, index) => (
//           <dga-progress-indicator-step currentStep={index + 1} title={step.label} description={step.description} activeStep={this.activeStep} />
//         ))}
//       </div>
//     );
//   }
// }
