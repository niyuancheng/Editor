import { ExtendedTypes } from "../../custom-types";
import { isPlainObject } from "is-plain-object";
import { ElementProps } from "./element-props";
import { Ancestor } from "./node";

export interface BaseElement {
  type: string;
  props?: ElementProps;
  children?: Array<Text | Element>;
}

export type Element = ExtendedTypes<"Element", BaseElement>;

export interface ElementInterface {
  isAncestor: (value: any) => value is Ancestor;
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

// export const ElementUtils: ElementInterface = {};
