import { h } from "@stencil/core";
export class DgaNavHeaderSubMenuLink {
    render() {
        const backgroundClass = this.background === 'Brand' ? 'sub-menu__link--on-color' : '';
        const linkStyleClass = this.linkStyle && this.linkStyle > 0 ? (this.linkStyle === 2 ? 'sub-menu__link-icon--bg' : 'sub-menu__link-icon') : '';
        return (h("a", { key: '2dee00123e0cb9369b57d61b6e992bc9e0fb9b96', href: this.link, class: `sub-menu__link ${backgroundClass}` }, this.linkStyle && this.linkStyle > 0 ? h("div", { class: linkStyleClass }, this.icon && h("dga-icon", { icon: this.icon })) : null, h("div", { key: '379c54ba9dc1774176de534eedbb764663526eaa', class: "dga-flex-column" }, h("span", { key: 'e8d20f991a28be8d01320be578ee52589b25681f', class: "sub-menu__link-label" }, this.label), this.helperText && h("span", { key: '5dcf79fe09ec044b8eb3ce6261c57d9193ff16b9', class: "sub-menu__link-helper" }, this.helperText))));
    }
    static get is() { return "dga-nav-header-sub-menu-link"; }
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
            "background": {
                "type": "string",
                "attribute": "background",
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
            "link": {
                "type": "string",
                "attribute": "link",
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
            "linkStyle": {
                "type": "number",
                "attribute": "link-style",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
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
            "helperText": {
                "type": "string",
                "attribute": "helper-text",
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
            }
        };
    }
}
