// import { Component, Prop, h, Fragment } from '@stencil/core';
// @Component({
//   tag: 'dga-menu-updated',
// })
// export class DgaMenuUpdated {
//   @Prop() groups: Array<{
//     label: string;
//     items: Array<{
//       trailElement?: any;
//       disabled?: boolean;
//       leadIcon?: any | null;
//       label?: string;
//     }>;
//   }> = [];
//   render() {
//     return (
//       <ul class="menu">
//         {this.groups.map((group, index) => (
//           <>
//             <div class="menu-group">
//               {group.label && <span class="menu-group__label">{group.label}</span>}
//               {group.items.map(item => (
//                 <dga-menu-item trailElement={item.trailElement} label={item.label} disabled={item.disabled} leadIcon={item.leadIcon} />
//               ))}
//             </div>
//             {index < this.groups.length - 1 && <span class="divider"></span>}
//           </>
//         ))}
//       </ul>
//     );
//   }
// }
