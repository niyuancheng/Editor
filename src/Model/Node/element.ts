import { ExtendedTypes } from "../../custom-types";
import { isPlainObject } from "is-plain-object";
import { ElementProps } from "./element-props";
import { Descedent, Ancestor, Editor } from "./node";
import { Text, TextUtils } from "./text";

export interface BaseElement {
  type: string;
  children: Array<Descedent>;
  props?: ElementProps;
  [props:string]: unknown;
}

export type Element = ExtendedTypes<"Element", BaseElement>;

export interface ElementInterface {
  // isAncestor: (value: any) => value is Ancestor;
  isElement: (value: any) => value is Element;
  isElementList: (value: any) => value is Element[];
  isElementProps: (props: any) => props is Partial<Element>;
  isElementType: <T extends Element>(
    value: any,
    elementVal: string,
    elementKey?: string
  ) => value is T;
  matches: (element: Element, props: Partial<Element>) => boolean;
}

export const ElementUtils: ElementInterface = {

  isElement(value: any): value is Element {
    return (
      isPlainObject(value) &&
      Array.isArray(value.children) &&
      value.children.filter((child: Descedent) => {
        return !TextUtils.isText(child) && !ElementUtils.isElement(child);
      }).length === 0 &&
      typeof value.type === "string"
    );
  },

  isElementList(value: any): value is Element[] {
    return (
      Array.isArray(value) &&
      value.every((child) => {
        return this.isElement(child);
      })
    );
  },

  isElementProps(props: any): props is Partial<Element> {
    return (
      (props as Partial<Element>).children !== undefined &&
      (props as Partial<Element>).type !== undefined
    );
  },

  isElementType<T extends Element>(
    value: any,
    elementVal: string,
    elementKey: string = "type"
  ): value is T {
    return this.isElement(value) && value[elementKey] === elementVal;
  },

  matches(element:Element, props:Partial<Element>): boolean {
    for(const key in props) {
      if(key === "children" || key === "type") continue;
      if(element.hasOwnProperty(key) && element[key] === props[key]) continue;
      return false;
    }
    return true;
  },
};
