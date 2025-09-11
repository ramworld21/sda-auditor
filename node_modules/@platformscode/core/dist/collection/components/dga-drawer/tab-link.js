import { h } from "@stencil/core";
export class TabLink {
    constructor() {
        this.type = 'parent';
        this.onColor = false;
        this.level = 1;
        this.externalLink = false;
        this.text = 'link';
        this.link = '/pages';
        this.expanded = false;
        this.disabled = false;
        this.isExpanded = this.expanded;
    }
    toggleTab(e) {
        var _a;
        if (this.type === 'parent') {
            e.preventDefault();
            this.isExpanded = !this.isExpanded;
            (_a = this.onExpand) === null || _a === void 0 ? void 0 : _a.call(this, this.isExpanded);
        }
    }
    handleMouseEvents(event) {
        const method = event === 'add' ? 'add' : 'remove';
        this.tabRef.classList[method]('pressed');
    }
    render() {
        const commonProps = {
            class: `${this.type === 'parent' ? 'sidepanel__menu-tab' : 'sidepanel__submenu-tab'} 
              ${this.level > 1 ? 'sidepanel__submenu--sublevel' : ''} 
              ${this.disabled ? 'disabled' : ''} 
              ${this.isExpanded ? 'active' : ''}`,
            onMouseDown: () => this.handleMouseEvents('add'),
            onMouseUp: () => this.handleMouseEvents('remove'),
            onMouseOut: () => this.handleMouseEvents('remove'),
            //   ref: (el: HTMLElement) => (this.tabRef = el),
            ref: el => (this.tabRef = el),
        };
        // External link case
        if (this.externalLink) {
            return (h("a", Object.assign({ href: this.link }, commonProps, { tabindex: "0" }), this.icon && h("span", { class: "sidepanel__menu-tab-icon" }, h("dga-icon-v2", Object.assign({}, this.icon))), h("span", { class: "sidepanel__menu-tab-label" }, this.text), this.type === 'parent' && (h("span", { class: "sidepanel__menu-tab-arrow" }, h("i", { class: "hgi-stroke hgi-arrow-down-01", style: { fontSize: '16px' } }), " ")), this.badge !== undefined && h("dga-tag", { color: this.onColor ? 'on-color' : 'gray', label: this.badge >= 100 ? '+99' : this.badge.toString(), size: "sm" })));
        }
        // Parent tab case
        if (this.type === 'parent') {
            console.log(this.icon, "this.iconthis.icon");
            return (h("a", Object.assign({ href: "#" }, commonProps, { onClick: e => this.toggleTab(e), tabindex: "0" }), this.icon && h("span", { class: "sidepanel__menu-tab-icon" }, h("dga-icon-v2", Object.assign({}, this.icon))), h("span", { class: "sidepanel__menu-tab-label" }, this.text), h("span", { class: "sidepanel__menu-tab-arrow" }, h("i", { class: "hgi-stroke hgi-arrow-down-01", style: { fontSize: '16px' } }), " "), this.badge !== undefined && h("dga-tag", { color: this.onColor ? 'on-color' : 'gray', label: this.badge >= 100 ? '+99' : this.badge.toString(), size: "sm" })));
        }
        // Child tab case (regular link)
        return (h("stencil-route-link", Object.assign({ url: this.link }, commonProps, { tabindex: "0" }), this.icon && h("span", { class: "sidepanel__menu-tab-icon" }, h("dga-icon-v2", Object.assign({}, this.icon))), h("span", { class: "sidepanel__menu-tab-label" }, this.text), this.badge !== undefined && h("dga-tag", { color: this.onColor ? 'on-color' : 'gray', label: this.badge >= 100 ? '+99' : this.badge.toString(), size: "sm" })));
    }
    static get is() { return "tab-link"; }
    static get properties() {
        return {
            "type": {
                "type": "string",
                "attribute": "type",
                "mutable": false,
                "complexType": {
                    "original": "'parent' | 'child'",
                    "resolved": "\"child\" | \"parent\"",
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
                "defaultValue": "'parent'"
            },
            "onColor": {
                "type": "boolean",
                "attribute": "on-color",
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
            },
            "level": {
                "type": "number",
                "attribute": "level",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
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
                "defaultValue": "1"
            },
            "badge": {
                "type": "number",
                "attribute": "badge",
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
            "icon": {
                "type": "unknown",
                "attribute": "icon",
                "mutable": false,
                "complexType": {
                    "original": "Icon",
                    "resolved": "Icon",
                    "references": {
                        "Icon": {
                            "location": "import",
                            "path": "../dga-avatar/dga-avatar",
                            "id": "src/components/dga-avatar/dga-avatar.tsx::Icon"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            },
            "externalLink": {
                "type": "boolean",
                "attribute": "external-link",
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
            },
            "text": {
                "type": "string",
                "attribute": "text",
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
                "defaultValue": "'link'"
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
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "'/pages'"
            },
            "expanded": {
                "type": "boolean",
                "attribute": "expanded",
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
            },
            "onExpand": {
                "type": "unknown",
                "attribute": "on-expand",
                "mutable": false,
                "complexType": {
                    "original": "(value: boolean) => void",
                    "resolved": "(value: boolean) => void",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            },
            "disabled": {
                "type": "boolean",
                "attribute": "disabled",
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
    static get states() {
        return {
            "isExpanded": {}
        };
    }
}
