import { ExtendedTypes } from "../../custom-types";
import { ElementProps } from "./element-props";
import { Descedent } from "./node";
export interface BaseElement {
    type: string;
    children: Array<Descedent>;
    props?: ElementProps;
    [props: string]: unknown;
}
export type Element = ExtendedTypes<"Element", BaseElement>;
export interface ElementInterface {
    isElement: (value: any) => value is Element;
    isElementList: (value: any) => value is Element[];
    isElementProps: (props: any) => props is Partial<Element>;
    isElementType: <T extends Element>(value: any, elementVal: string, elementKey?: string) => value is T;
    matches: (element: Element, props: Partial<Element>) => boolean;
}
export declare const ElementUtils: ElementInterface;
