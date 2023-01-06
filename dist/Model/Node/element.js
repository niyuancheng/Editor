import { isPlainObject } from "is-plain-object";
import { TextUtils } from "./text";
export const ElementUtils = {
    isElement(value) {
        return (isPlainObject(value) &&
            Array.isArray(value.children) &&
            value.children.filter((child) => {
                return !TextUtils.isText(child) && !ElementUtils.isElement(child);
            }).length === 0 &&
            typeof value.type === "string");
    },
    isElementList(value) {
        return (Array.isArray(value) &&
            value.every((child) => {
                return this.isElement(child);
            }));
    },
    isElementProps(props) {
        return (props.children !== undefined &&
            props.type !== undefined);
    },
    isElementType(value, elementVal, elementKey = "type") {
        return this.isElement(value) && value[elementKey] === elementVal;
    },
    matches(element, props) {
        for (const key in props) {
            if (key === "children" || key === "type")
                continue;
            if (element.hasOwnProperty(key) && element[key] === props[key])
                continue;
            return false;
        }
        return true;
    },
};
//# sourceMappingURL=element.js.map