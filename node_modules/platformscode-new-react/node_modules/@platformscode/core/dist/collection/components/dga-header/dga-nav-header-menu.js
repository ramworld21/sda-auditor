import { h } from "@stencil/core";
export class DgaNavHeaderMenu {
    render() {
        return (h("ul", { key: '4636f92fd9eee78d8975b84c2e02ff1e69c866b6', class: "header-nav__menu" }, h("slot", { key: 'b1e377554e828769cc2110785a409b5d4c833d2a' })));
    }
    static get is() { return "dga-nav-header-menu"; }
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
}
