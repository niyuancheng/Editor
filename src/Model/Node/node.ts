import {Element,ExtendedTypes,Text,TextUtils,ElementUtils} from "../../index"

export type BaseEditor = {
    children:Descedent[];
}

export type Editor = ExtendedTypes<"Editor",BaseEditor>;

export type Ancestor = Editor | Element;
export type Descedent = Element | Text;

export type Node = Element | Text;
