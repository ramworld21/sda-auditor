// // import { Component, Prop, h } from '@stencil/core';
// // @Component({
// //   tag: 'dga-local-icon',
// // })
// // export class DgaLocalIcon {
// //   @Prop() icon: string; // The id of the symbol
// //   @Prop() size: number = 24;
// //   @Prop() color?: string;
// //   render() {
// //     return (
// //       <svg width={this.size} height={this.size} fill={this.color || 'currentColor'} aria-hidden="true">
// //         <use href={`../../assets/sprite.svg#${this.icon}`}></use>
// //       </svg>
// //     );
// //   }
// // }
// import { Component, Prop, getAssetPath, h } from '@stencil/core';
// @Component({
//   tag: 'dga-icon',
//   assetsDirs: ['assets']
// })
// export class DgaIcon {
//   @Prop() icon: string; // The id of the symbol
//   @Prop() size: number = 24;
//   @Prop() color?: string;
//   @Prop() variant?: 'stroke' | 'solid' | 'duotone' | 'twotone' | 'bulk' = 'bulk';
//   @Prop() type?: 'rounded' | 'sharp' | 'standard' = 'rounded';
//  // In your dga-local-icon.tsx file
// render() {
//   // 1. Exit early if the icon prop is missing
//   if (!this.icon) {
//     return null;
//   }
//   // 2. Resolve the asset path
//   const spriteFileUrl = getAssetPath(`../assets/icons/hgi-${this.variant}-${this.type}.symbol.svg`);
//   console.log('Sprite File URL:', spriteFileUrl); // Debugging line to check the resolved path
//   // 3. NEW: Add a check to ensure the path was successfully resolved
//   if (!spriteFileUrl) {
//     // If the path is not yet available, render nothing to avoid the error.
//     // The component will re-render automatically when the path becomes available.
//     return null;
//   }
//   // 4. Construct the final URL only when the path is valid
//   const finalIconUrl = `${spriteFileUrl}#${this.icon}`;
//   return (
//     <svg width={this.size} height={this.size} style={{ color: this.color || 'currentColor' }} aria-hidden="true">
//       <use href={finalIconUrl}></use>
//     </svg>
//   );
// }
// }
