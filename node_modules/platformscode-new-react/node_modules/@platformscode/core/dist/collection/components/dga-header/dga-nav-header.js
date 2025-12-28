import { Host, h } from "@stencil/core";
export class DgaNavHeader {
    constructor() {
        this.fullWidth = true;
        this.divider = true;
        this.sticky = false;
    }
    // @Prop() position: 'sticky' | 'relative' = 'relative';
    render() {
        return (h(Host, { key: '09079f60b8184429afa9ee0353bdf66f8fd316a5' }, h("header", { key: 'ac7708f38d81388d5483f52243c57ff72ef63c37', class: `header ${this.divider ? 'header--divider' : ''} ${this.sticky ? 'header--sticky' : ''}` }, h("nav", { key: '788d0ee9c0aaa6f692554adb4fb419051b12b5d7', class: `header-nav--${this.fullWidth ? 'full' : 'fixed'}` }, h("slot", { key: 'cbb955f2a4fde6094cfd2f15f332f201915ec72d' })))));
    }
    static get is() { return "dga-nav-header"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["dga-nav-header-sub-menu.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dga-nav-header-sub-menu.css"]
        };
    }
    static get properties() {
        return {
            "fullWidth": {
                "type": "boolean",
                "attribute": "full-width",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "true"
            },
            "divider": {
                "type": "boolean",
                "attribute": "divider",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "true"
            },
            "sticky": {
                "type": "boolean",
                "attribute": "sticky",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "false"
            }
        };
    }
}
