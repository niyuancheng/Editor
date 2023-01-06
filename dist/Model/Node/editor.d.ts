import { Descedent, ExtendedTypes, Selection, Text } from "../../index";
export type BaseEditor = {
    children: Descedent[];
    selection: Selection;
    marks?: EditorMarks;
    [props: string]: unknown;
};
export type Editor = ExtendedTypes<"Editor", BaseEditor>;
export type EditorMarks = Omit<Text, "text">;
export interface EditorInterface {
}
export declare const EditorUtils: EditorInterface;
