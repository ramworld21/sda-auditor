var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// hugeicon-component.ts
import { h } from "@stencil/core";
const toKebabCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};
// Default SVG attributes
const defaultAttributes = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};
// This function creates a render function for StencilJS components
export function createHugeiconRender(svgObject) {
    return function (props) {
        const { size = 24, color = 'currentColor', strokeWidth = 1.5, class: classStr = '', className = '' } = props, rest = __rest(props, ["size", "color", "strokeWidth", "class", "className"]);
        // Convert the class string to an object format that StencilJS expects
        const classNames = (classStr || className || '').split(' ').filter(Boolean);
        const classObj = {};
        classNames.forEach(name => {
            classObj[name] = true;
        });
        const elementProps = Object.assign(Object.assign(Object.assign({}, defaultAttributes), { width: size, height: size, strokeWidth: strokeWidth, color,
            className }), rest);
        // // Process attributes for child elements
        // const children = svgObject.map(([tag, attrs]) => {
        //   // Convert attribute keys to kebab-case for SVG elements
        //   const processedAttrs: Record<string, any> = {};
        //   Object.entries(attrs).forEach(([key, value]) => {
        //     // Handle special case like stroke-width -> strokeWidth
        //     if (key.includes('-')) {
        //       const camelCaseKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        //       processedAttrs[camelCaseKey] = value;
        //     } else {
        //       processedAttrs[key] = value;
        //     }
        //   });
        //   return h(tag, { key: attrs.id || tag, ...processedAttrs });
        // });
        // Create child SVG elements
        const children = svgObject.map(([tag, attrs]) => {
            const processedAttrs = {};
            Object.entries(attrs).forEach(([key, value]) => {
                const kebabKey = toKebabCase(key);
                processedAttrs[kebabKey] = value;
            });
            return h(tag, Object.assign({ key: attrs.id || tag }, processedAttrs));
        });
        // Use StencilJS's h() function to create elements
        return h('svg', elementProps, children);
    };
}
