// // icon-factory.ts
// import { Component, Prop, h } from '@stencil/core';
// import { IconSvgObject, createHugeiconRender } from './hugeicon-component';
// export function createIconComponent(iconName: string, svgObject: IconSvgObject) {
//   @Component({
//     tag: `dga-icon-${iconName.toLowerCase()}`,
//     shadow: true,
//   })
//   class Icon {
//     @Prop() size?: string | number = 24;
//     @Prop() color?: string = 'currentColor';
//     @Prop() strokeWidth?: number = 1.5;
//     private renderIcon = createHugeiconRender(iconName, svgObject);
//     render() {
//       return this.renderIcon({
//         size: this.size,
//         color: this.color,
//         strokeWidth: this.strokeWidth,
//       });
//     }
//   }
//   return Icon;
// }
// // Usage example:
// // const PlusIcon = createIconComponent('Plus', mySvgObject);
// // export { PlusIcon };
