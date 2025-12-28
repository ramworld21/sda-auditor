import { h } from "@stencil/core";
// import { Icon } from '../dga-avatar/dga-avatar';
export class DgaNavHeaderMain {
    constructor() {
        this.collapsed = false;
        this.isOpen = false;
        this.handleToggle = () => {
            this.toggleCollapsed.emit(!this.collapsed);
        };
    }
    render() {
        // const leadIconProps:Icon = {
        //   name: this.collapsed ? 'menu01' : 'cancel01',
        //   size: 24,
        //   variant: 'stroke',
        //   type: 'rounded',
        // };
        return (h("div", { key: 'a1dff73d8f31d321d666021c13314d5746850a6e', class: "header-nav__main" }, h("slot", { key: 'd49f46410cfb6fbeb17a07d03da87078cd7ec025' })));
    }
    static get is() { return "dga-nav-header-main"; }
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
            "collapsed": {
                "type": "boolean",
                "attribute": "collapsed",
                "mutable": true,
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
                "reflect": true,
                "defaultValue": "false"
            }
        };
    }
    static get states() {
        return {
            "isOpen": {}
        };
    }
    static get events() {
        return [{
                "method": "toggleCollapsed",
                "name": "toggleCollapsed",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                }
            }];
    }
}
