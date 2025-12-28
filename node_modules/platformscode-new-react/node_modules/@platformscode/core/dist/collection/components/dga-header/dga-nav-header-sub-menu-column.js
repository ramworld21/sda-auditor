import { h } from "@stencil/core";
export class DgaNavHeaderSubMenuColumn {
    constructor() {
        this.label = '';
    }
    render() {
        return (h("div", { key: '6e1da63bec0f43ffe7ead12177415d1405aaee94', class: "sub-menu__column" }, this.label && h("h2", { key: '6827e08158b5698e7acec121e4ac88355faed8e0', class: "sub-menu__column__label" }, this.label), h("slot", { key: '41e7ff1766b0fd3cd30681b0fc6f0ada96bd4c3f' })));
    }
    static get is() { return "dga-nav-header-sub-menu-column"; }
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
            "label": {
                "type": "string",
                "attribute": "label",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "''"
            }
        };
    }
}
