import { ExtendedTypes } from "../../custom-types";
import { Path } from "../Location/path";
import { Node } from "../Node/node";
export type BaseInsertNodeOperation = {
    type: "insert_node";
    path: Path;
    node: Node;
};
export type InsertNodeOperation = ExtendedTypes<"InsertNodeOperation", BaseInsertNodeOperation>;
export type BaseRemoveNodeOperation = {
    type: "remove_node";
    path: Path;
};
export type RemoveNodeOperation = ExtendedTypes<"RemoveNodeOperation", BaseRemoveNodeOperation>;
export type BaseMergeNodeOperation = {
    type: "merge_node";
    path: Path;
    count: number;
};
export type MergeNodeOperation = ExtendedTypes<"MergeNodeOperation", BaseMergeNodeOperation>;
export type BaseSplitNodeOperation = {
    type: "split_node";
    path: Path;
    count: number;
};
export type SplitNodeOperation = ExtendedTypes<"SplitNodeOperation", BaseSplitNodeOperation>;
export type BaseMoveNodeOperation = {
    type: "move_node";
    path: Path;
    newPath: Path;
};
export type MoveNodeOperation = ExtendedTypes<"MoveNodeOperation", BaseMoveNodeOperation>;
export type NodeOperation = InsertNodeOperation | RemoveNodeOperation | MergeNodeOperation | MoveNodeOperation | SplitNodeOperation;
export type BaseInsertTextOperation = {
    type: "insert_text";
    path: Path;
    offset: number;
    text: string;
};
export type InsertTextOperation = ExtendedTypes<"InsertTextOperation", BaseInsertTextOperation>;
export type BaseRemoveTextOperation = {
    type: "remove_text";
    path: Path;
    offset: number;
    text: string;
};
export type RemoveTextOperation = ExtendedTypes<"RemoveTextOperation", BaseRemoveTextOperation>;
export type TextOperation = InsertTextOperation | RemoveTextOperation;
export type Operation = NodeOperation | TextOperation;
