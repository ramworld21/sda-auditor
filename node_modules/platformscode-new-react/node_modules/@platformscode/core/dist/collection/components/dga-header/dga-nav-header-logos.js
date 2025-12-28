import { h } from "@stencil/core";
export class DgaNavHeaderLogos {
    constructor() {
        this.logoLink = '#';
        this.govLink = '#';
    }
    render() {
        return (h("div", { key: '4307ccbe26e7e25126eb4d21ec6657d0b74561d7', class: "header-nav__branding" }, this.govSrc && (h("div", { key: '3d2d2b5766b1593e52d589abc0f181397a5d84d2', class: "dga-flex xs-hide" }, h("a", { key: '700a39b5a5eeda62fb279b9b9cd4087a7fe3e6ed', href: this.govLink }, h("img", { key: 'f4aa859b82ee694136a229e04c565953330156e0', src: this.govSrc, alt: this.govAlt })), h("div", { key: '9cd150cd475c694b29ca0fe7940c2f56f67e0706', class: "dga-ver-divider" }))), h("a", { key: '03f48eb1f8b6726b9d3227156b576530c491c2b7', href: this.logoLink, class: "header__logo" }, h("img", { key: 'cd54d2aecc433035c29c3008f514f6b3b5531449', src: this.logoSrc, alt: this.logoAlt }))));
    }
    static get is() { return "dga-nav-header-logos"; }
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
            "logoSrc": {
                "type": "string",
                "attribute": "logo-src",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
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
                "reflect": false
            },
            "logoAlt": {
                "type": "string",
                "attribute": "logo-alt",
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
                "reflect": false
            },
            "logoLink": {
                "type": "string",
                "attribute": "logo-link",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
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
                "defaultValue": "'#'"
            },
            "govSrc": {
                "type": "string",
                "attribute": "gov-src",
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
                "reflect": false
            },
            "govAlt": {
                "type": "string",
                "attribute": "gov-alt",
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
                "reflect": false
            },
            "govLink": {
                "type": "string",
                "attribute": "gov-link",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
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
                "defaultValue": "'#'"
            }
        };
    }
}
