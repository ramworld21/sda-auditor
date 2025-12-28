import { h } from "@stencil/core";
export class DgaHeaderActionBtn {
    constructor() {
        this.active = false;
        this.extraClasses = '';
        this.subMenuBackground = 'white';
        this.subMenuFullWidth = true;
        this.openSubMenu = false;
    }
    handleClick(event) {
        event.preventDefault();
        if (this.onClick) {
            this.onClick();
        }
    }
    componentWillLoad() {
        this.el.childNodes.forEach(item => {
            const el = item;
            if (el.tagName === 'DGA-NAV-HEADER-SUB-MENU' && el.attributes.getNamedItem('slot') === null) {
                el.setAttribute('slot', 'dga-nav-header-sub-menu');
            }
        });
    }
    render() {
        return (h("li", { key: 'd18c4cd96870c00901bf626d33b0e89f2d2e09ac', onMouseEnter: () => {
                this.openSubMenu = true;
                this.active = true;
            }, onMouseLeave: () => {
                this.openSubMenu = false;
                this.active = false;
            } }, h("a", { key: '0653a2154550ea15dc8d1f6370f9ee4972de9bd5', href: "#", class: `header-menu__item ${this.active ? 'header-menu__item--active' : ''} ${this.extraClasses}`, onClick: this.handleClick.bind(this) }, h("span", { key: '30d42e2f8ed5e59298788d5bfe9bafb911b1bf69', class: "header-menu__item-arrow" }, h("dga-icon", { key: 'dc79b2d49da95bad07e778315710a4f91fdb23ca', icon: this.icon })), h("span", { key: '778121626d0435ffe884996603f1b2a634c3fea4', class: "header-menu__item-label" }, this.label)), this.openSubMenu && h("slot", { key: '03c2bc0887136ce5170652e101eb6d84f3dcd03a', name: "dga-nav-header-sub-menu" })));
    }
    static get is() { return "dga-header-action-btn"; }
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
                "reflect": false
            },
            "icon": {
                "type": "string",
                "attribute": "icon",
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
            "active": {
                "type": "boolean",
                "attribute": "active",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
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
                "defaultValue": "false"
            },
            "extraClasses": {
                "type": "string",
                "attribute": "extra-classes",
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
            },
            "onClick": {
                "type": "unknown",
                "attribute": "on-click",
                "mutable": false,
                "complexType": {
                    "original": "() => void",
                    "resolved": "() => void",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            },
            "subMenuBackground": {
                "type": "string",
                "attribute": "sub-menu-background",
                "mutable": false,
                "complexType": {
                    "original": "'brand' | 'white'",
                    "resolved": "\"brand\" | \"white\"",
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
                "defaultValue": "'white'"
            },
            "subMenuFullWidth": {
                "type": "boolean",
                "attribute": "sub-menu-full-width",
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
            }
        };
    }
    static get states() {
        return {
            "openSubMenu": {}
        };
    }
    static get elementRef() { return "el"; }
}
