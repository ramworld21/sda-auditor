import { h } from "@stencil/core";
export class SubmenuComponent {
    handleExpanded(expanded) {
        if (expanded) {
            this.submenuElement.style.maxHeight = 'fit-content';
        }
        else {
            this.submenuElement.style.maxHeight = '';
        }
        const subHeight = this.submenuElement.scrollHeight;
        this.onChildExpanded(expanded, subHeight);
    }
    render() {
        if (!this.childRoute.children || this.childRoute.children.length === 0) {
            return (h("li", { key: this.childRoute.path }, h("tab-link", { text: this.childRoute.name, link: `${this.route.path}${this.childRoute.path}`, level: this.childRoute.level, type: "child", icon: this.childRoute.icon, badge: this.childRoute.badge, disabled: this.childRoute.disabled })));
        }
        return (h("li", { key: this.childRoute.path }, h("tab-link", { text: this.childRoute.name, link: `${this.route.path}${this.childRoute.path}`, type: "parent", icon: this.childRoute.icon, disabled: this.childRoute.disabled, onExpand: this.handleExpanded.bind(this) }), h("ul", { class: "sidepanel__submenu-list", ref: el => (this.submenuElement = el) }, this.childRoute.children.map((subSubRoute, index) => (h("submenu-component", { key: index, route: this.route, childRoute: subSubRoute }))))));
    }
    static get is() { return "submenu-component"; }
    static get properties() {
        return {
            "route": {
                "type": "unknown",
                "attribute": "route",
                "mutable": false,
                "complexType": {
                    "original": "IRoute",
                    "resolved": "IRoute",
                    "references": {
                        "IRoute": {
                            "location": "import",
                            "path": "./dga-drawer",
                            "id": "src/components/dga-drawer/dga-drawer.tsx::IRoute"
                        }
                    }
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
            "childRoute": {
                "type": "unknown",
                "attribute": "child-route",
                "mutable": false,
                "complexType": {
                    "original": "IRoute",
                    "resolved": "IRoute",
                    "references": {
                        "IRoute": {
                            "location": "import",
                            "path": "./dga-drawer",
                            "id": "src/components/dga-drawer/dga-drawer.tsx::IRoute"
                        }
                    }
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
            "onChildExpanded": {
                "type": "unknown",
                "attribute": "on-child-expanded",
                "mutable": false,
                "complexType": {
                    "original": "(expanded: boolean, subHeight: number) => void",
                    "resolved": "(expanded: boolean, subHeight: number) => void",
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
            }
        };
    }
}
