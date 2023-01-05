import { ExtendedTypes } from "../../custom-types";
import { isPlainObject } from "is-plain-object";
import { Range } from "../Location/range";

export type BaseText = {
  text: string;
};

export type Text = ExtendedTypes<"Text", BaseText>;

export interface TextInterface {
  equals: (text: Text, another: Text) => boolean;
  isText: (value: any) => value is Text;
  isTextList: (value: any) => value is Text[];
//   isTextProps: (props: any) => props is Partial<Text>;
  matches: (text: Text, props: Partial<Text>) => boolean;
  decorations: (node: Text, decorations: Range[]) => Text[];
}

export const TextUtils: TextInterface = {
  isText(value: any): value is Text {
    return isPlainObject(value) && value.text && typeof value.text === "string";
  },
  equals(text: Text, another: Text): boolean {
    return text.text === another.text;
  },
  isTextList(value:any):value is Text[] {
      return Array.isArray(value) && value.filter(item=>{
        return !this.isText(item)
      }).length === 0
  },
};
