// import { Component, Prop, State, h } from '@stencil/core';
// @Component({
//   tag: 'dga-data-table',
// })
// export class DgaDataTable {
//   @Prop() data = [
//     {
//       selected: true,
//     },
//     {
//       selected: true,
//     },
//   ];
//   @Prop() rowDivider = true;
//   @Prop() showSelectCheckBox = true;
//   @Prop() alternate = true;
//   @Prop() cells: {
//     title: string;
//     isSort: boolean;
//     isFilter: boolean;
//     sort?: 'up' | 'down';
//     propertyName: string;
//     type: 'element' | 'propertyName';
//     El?: HTMLElement;
//     elProperties?: string[];
//     colSpan?: number;
//     // elProperties: { [key: string]: any };
//   }[] = [
//     {
//       propertyName: 'test',
//       isFilter: false,
//       isSort: false,
//       title: 'Test',
//       type: 'propertyName',
//       colSpan: 1,
//     },
//     {
//       propertyName: 'test',
//       isFilter: false,
//       isSort: false,
//       title: 'Test',
//       type: 'propertyName',
//       colSpan: 1,
//     },
//   ];
//   @Prop() contained = true;
//   @Prop() getSelectedRows;
//   @Prop() pressOnFilter;
//   @State() sortedData: any[] = [];
//   @State() direction: boolean = false;
//   private sortData = (sortType: 'up' | 'down' = 'up', sortingProperty: string, index: number) => {
//     if (sortType === 'up') {
//       const clonedData = [...this.data.sort((a, b) => (b[sortingProperty] > a[sortingProperty] ? 1 : a[sortingProperty] > b[sortingProperty] ? -1 : 0))];
//       this.sortedData = clonedData;
//     } else if (sortType === 'down') {
//       const clonedData = [...this.data.sort((a, b) => (a[sortingProperty] > b[sortingProperty] ? 1 : b[sortingProperty] > a[sortingProperty] ? -1 : 0))];
//       this.sortedData = clonedData;
//     }
//     this.cells[index].sort = sortType == 'down' ? 'up' : 'down';
//   };
//   private handleSelectedRowChanges = (checked: boolean, index: number) => {
//     const cloneData = [...this.data];
//     cloneData[index].selected = checked;
//     this.sortedData = cloneData;
//     if (this.getSelectedRows) {
//       this.getSelectedRows({
//         selectedRows: cloneData.filter(item => item.selected),
//         currentSelectedRow: cloneData[index],
//         currentSelectedRowIndex: index,
//       });
//     }
//   };
//   private selectAll = (checked: boolean) => {
//     const cloneData = [...this.data];
//     cloneData.forEach(item => (item.selected = checked));
//     this.sortedData = cloneData;
//     if (this.getSelectedRows) {
//       this.getSelectedRows({
//         selectedRows: cloneData,
//       });
//     }
//   };
//   componentDidLoad() {
//     if (document.dir) {
//       if (document.dir === 'rtl') this.direction = true;
//       else this.direction = false;
//     } else if (document.documentElement.lang) {
//       if (document.documentElement.lang === 'ar') this.direction = true;
//       else this.direction = false;
//     } else this.direction = false;
//   }
//   componentDidUpdate() {
//     const cloneData = [
//       ...this.data.map(item => {
//         item.selected = false;
//         return item;
//       }),
//     ];
//     this.sortedData = cloneData;
//   }
//   //     @Prop() onColor: boolean;
//   //     @Prop() size: "sm" | "md" | "lg";
//   //     @Prop() items: {
//   //         label: React.ReactNode;
//   //         content: React.ReactNode;
//   //     }[] = [
//   //         {
//   //             label:"test label",
//   //             content:"test content"
//   //         },
//   //         {
//   //             label:"test label",
//   //             content:"test content"
//   //         },
//   //         {
//   //             label:"test label",
//   //             content:"test content"
//   //         }
//   //     ];
//   //     @State() selected: number = 0;
//   //     private handleSelect = (index: number) => {
//   //         this.selected = index;
//   //     };
//   render() {
//     return (
//               <tr class={`${this.rowDivider ? 'row-divider' : ''} ${this.alternate ? 'alternate' : ''} ${row.selected ? 'row-selected' : ''} `} key={rowIndex}>
//                 {this.showSelectCheckBox && (
//                   <td>
//                     <dga-checkbox
//                       name={rowIndex + 'checkboxSelection'}
//                       value={row.selected}
//                       id={rowIndex + 'checkboxSelection'}
//                       showBorderOnFocusAndFocusOute={false}
//                       onChange={event => this.handleSelectedRowChanges(event.target.checked, rowIndex)}
//                       checked={row.selected}
//                     />
//                   </td>
//                 )}
//               </tr>
//     );
//   }
// }
