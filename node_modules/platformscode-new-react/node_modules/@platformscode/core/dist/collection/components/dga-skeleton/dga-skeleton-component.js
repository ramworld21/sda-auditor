import { h } from "@stencil/core";
export class SkeletonComponent {
    constructor() {
        /**
         * Type of the skeleton layout
         */
        this.type = 'chart and content';
    }
    renderSkeletonContent() {
        switch (this.type) {
            case 'chart and content':
                return (h("div", { class: " chart_and_content" }, h("div", { class: "wrapper" }, h("dga-circle-skeleton", { width: "240px", type: "2" }), h("div", { class: "line_wrapper" }, h("dga-line-skeleton", { size: "lg" }), h("dga-line-skeleton", { size: "lg" }), h("dga-line-skeleton", { size: "lg" })))));
            case 'image content and button':
                return (h("div", { class: " image_content_and_button" }, h("div", { class: "wrapper" }, h("dga-square-skeleton", { width: "240px", type: "1" }), h("div", { class: "line_wrapper" }, h("dga-line-skeleton", { size: "lg" }), h("dga-line-skeleton", { size: "lg" }), h("dga-line-skeleton", { size: "lg" })), h("div", { class: "last" }, h("dga-rectangle-skeleton", { size: "sm", width: "short" })))));
            case 'image profile content':
                return (h("div", { class: " image_profile_content" }, h("div", { class: "wrapper" }, h("dga-square-skeleton", { width: "240px", type: "1" }), h("div", { class: "first" }, h("dga-circle-skeleton", { width: "24px" }), h("dga-rectangle-skeleton", { size: "sm", width: "short" })), h("div", { class: "line_wrapper" }, h("dga-line-skeleton", { size: "lg" }), h("dga-line-skeleton", { size: "lg" }), h("dga-line-skeleton", { size: "lg" })), h("div", { class: "last" }, h("dga-rectangle-skeleton", { size: "sm", width: "short" })))));
            case 'image button and text':
                return (h("div", { class: " image_button_and_text" }, h("div", { class: "wrapper" }, h("div", { class: "left" }, h("dga-circle-skeleton", { width: "48px", type: "2" })), h("div", { class: "right" }, h("dga-line-skeleton", { size: "sm" }), h("dga-rectangle-skeleton", { size: "md", width: "short" })))));
            case 'icon and list':
                return (h("div", { class: " icon_and_list" }, h("div", { class: "wrapper" }, h("div", { class: "left" }, h("dga-square-skeleton", { width: "48px", type: "1" })), h("div", { class: "right" }, h("dga-line-skeleton", { size: "sm" }), h("dga-line-skeleton", { size: "sm" }), h("dga-line-skeleton", { size: "sm" })))));
            default:
                return null;
        }
    }
    render() {
        return this.renderSkeletonContent();
    }
    static get is() { return "dga-skeleton-component"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["./style.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["style.css"]
        };
    }
    static get properties() {
        return {
            "type": {
                "type": "string",
                "attribute": "type",
                "mutable": false,
                "complexType": {
                    "original": "| 'chart and content'\n    | 'image content and button'\n    | 'image profile content'\n    | 'image button and text'\n    | 'icon and list'",
                    "resolved": "\"chart and content\" | \"icon and list\" | \"image button and text\" | \"image content and button\" | \"image profile content\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Type of the skeleton layout"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "'chart and content'"
            }
        };
    }
}
