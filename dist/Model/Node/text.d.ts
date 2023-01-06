import { ExtendedTypes } from "../../custom-types";
import { Range } from "../Location/range";
import { TextProps } from "./text-props";
export interface BaseText {
    text: string;
    props?: TextProps;
    [props: string]: unknown;
}
export type Text = ExtendedTypes<"Text", BaseText>;
export interface TextInterface {
    equals: (text: Text, another: Text) => boolean;
    isText: (value: any) => value is Text;
    isTextList: (value: any) => value is Text[];
    matches: (text: Text, props: Partial<Text>) => boolean;
    decorations: (node: Text, decorations: Range[]) => Text[];
}
export declare const TextUtils: TextInterface;
