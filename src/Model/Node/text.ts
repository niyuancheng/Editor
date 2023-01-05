import { ExtendedTypes } from "../../custom-types";
import { isPlainObject } from "is-plain-object";
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
  isTextList(value: any): value is Text[] {
    return (
      Array.isArray(value) &&
      value.filter((item) => {
        return !this.isText(item);
      }).length === 0
    );
  },
  matches(text: Text, props: Partial<Text>): boolean {
    for (const key in props) {
      if (key === "text") continue;
      if (!text.hasOwnProperty(key) || text[key] !== props[key]) return false;
    }
    return true;
  },
  /**
   * Get the leaves for a text node given decorations.
   */
  decorations(node: Text, decorations: Range[]): Text[] {
    let leaves:Text[] = [{ ...node }];

    for (let desc of decorations) {
      let { from: start, to: end } = desc;
      let next = [];
      let leafEnd = 0;
      for (let leaf of leaves) {
        let { text } = leaf;
        let leafStart = leafEnd;
        leafEnd += text.length;
        //1.Range完全超出了字符串的范围
        if (end.offset <= leafStart || start.offset >= leafEnd) {
          next.push(leaf);
          continue;
        }
        //2.Range完全覆盖字符串
        if (start.offset <= leafStart && end.offset >= leafEnd) {
          next.push(leaf);
          continue;
        }
        //3.有部分相交,但字符串没有完全包含Range
        if (
          (start.offset <= leafStart &&
            end.offset < leafEnd &&
            end.offset > leafStart) ||
          (start.offset > leafStart &&
            start.offset < leafEnd &&
            end.offset >= leafEnd)
        ) {
            let s = start.offset <= leafStart ? leafStart : start.offset;
            let e = end.offset >= leafEnd ? leafEnd : end.offset;
            next.push(text.slice(s,e));
            if(s === leafStart) {
                next.push(text.slice(e,leafEnd));    
                
            } else if(e === leafEnd){
                next.push(text.slice(leafStart,s));
            }
            continue;
        }
        //4.字符串完全包含了Range
        let s = start.offset;
        let e = end.offset;
        next.push(text.slice(leafStart,s));
        next.push(text.slice(s,e));
        next.push(text.slice(e,leafEnd));
      }

      leaves = next as Text[];
    }
    return leaves;
  },
};
