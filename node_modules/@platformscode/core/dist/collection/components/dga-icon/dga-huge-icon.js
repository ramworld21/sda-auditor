// // import { Component, Prop, State } from '@stencil/core';
// // import { createHugeiconRender } from '../../utils/hugeicon-component';
// // @Component({
// //   tag: 'dga-huge-icon',
// //   styleUrl: 'dga-huge-icon.scss',
// //   shadow: true,
// // })
// // export class DgaHugeIcon {
// //   @Prop() name!: string;
// //   @Prop() size?: string | number = 24;
// //   @Prop() color?: string = 'currentColor';
// //   @Prop() strokeWidth?: number = 1.5;
// //   @Prop() class?: string = '';
// //   @Prop() variant?: 'stroke' | 'solid' | 'duotone' | 'twotone' | 'bulk' = 'stroke';
// //   @Prop() type?: 'rounded' | 'sharp' | 'standard' = 'rounded';
// //   @State() iconSvgObject: any = null;
// //   // async componentWillLoad() {
// //   //   try {
// //   //     const module = await import(`https://hugeicons-cdn.vercel.app/icons/${this.variant}-${this.type}/${this.name}.js`);
// //   //     this.iconSvgObject = module.iconSvgObject;
// //   //   } catch (error) {
// //   //     console.log(error)
// //   //     console.error(`Icon "${this.name}" not found.`);
// //   //   }
// //   // }
// //   async componentWillLoad() {
// //     try {
// //       const response = await fetch(`https://hugeicons-cdn.vercel.app/icons/${this.variant}-${this.type}/${this.name}.json`);
// //       if (!response.ok) {
// //         throw new Error('Icon not found');
// //       }
// //       const json = await response.json();
// //       this.iconSvgObject = json;
// //     } catch (error) {
// //       console.error(error);
// //       console.error(`Icon "${this.name}" not found.`);
// //     }
// //   }
// //   render() {
// //     if (!this.iconSvgObject) {
// //       return null; // or a placeholder
// //     }
// //     const renderIcon = createHugeiconRender(this.iconSvgObject);
// //     return renderIcon({
// //       size: this.size,
// //       color: this.color,
// //       strokeWidth: this.strokeWidth,
// //       class: this.class,
// //     });
// //   }
// // }
// import { Component, getAssetPath, Prop, State } from '@stencil/core';
// import { createHugeiconRender } from '../../utils/hugeicon-component';
// @Component({
//   tag: 'dga-huge-icon',
//   styleUrl: 'dga-huge-icon.scss',
//   shadow: true,
// })
// export class DgaHugeIcon {
//   @Prop() name!: string;
//   @Prop() size?: string | number = 24;
//   @Prop() color?: string = 'currentColor';
//   @Prop() strokeWidth?: number = 1.5;
//   @Prop() class?: string = '';
//   @Prop() variant?: 'stroke' | 'solid' | 'duotone' | 'twotone' | 'bulk' = 'stroke';
//   @Prop() type?: 'rounded' | 'sharp' | 'standard' = 'rounded';
//   @State() iconSvgObject: any = null;
//   async componentWillLoad() {
//     // Ensure 'name' is provided before attempting to fetch
//     if (!this.name) {
//       console.error('Icon name property is required.');
//       return;
//     }
//     try {
//       // 1. Get the correct path to the local asset as a string.
//       const iconUrl = getAssetPath(`/assets/json-icons/icons/${this.variant}-${this.type}/${this.name}.json`);
//       // 2. Use the fetch API to retrieve the asset from the generated URL.
//       const response = await fetch(iconUrl);
//       // 3. Check if the request was successful.
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       // 4. Parse the JSON data from the response.
//       const iconData = await response.json();
//       this.iconSvgObject = iconData;
//     } catch (error) {
//       // Provide a more informative error message.
//       console.error(`Failed to load icon "${this.name}" from /assets/icons/${this.variant}-${this.type}/.`, error);
//       this.iconSvgObject = null; // Ensure we don't render a broken icon
//     }
//   }
//   render() {
//     // If the icon data couldn't be loaded, render nothing or a placeholder.
//     if (!this.iconSvgObject) {
//       return null; 
//     }
//     // The createHugeiconRender function should return a VNode or a function that returns a VNode.
//     const renderIcon = createHugeiconRender(this.iconSvgObject);
//     return renderIcon({
//       size: this.size,
//       color: this.color,
//       strokeWidth: this.strokeWidth,
//       class: this.class,
//     });
//   }
// }
