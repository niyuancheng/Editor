import { ExtendedTypes } from "../../custom-types";
import { Path } from "../Location/path";
import { Node } from "../Node/node";

// 插入节点
export type BaseInsertNodeOperation = {
  type: "insert_node";
  path: Path;
  node: Node;
};
export type InsertNodeOperation = ExtendedTypes<
  "InsertNodeOperation",
  BaseInsertNodeOperation
>;

// 移除节点
export type BaseRemoveNodeOperation = {
  type: "remove_node";
  path: Path;
};
export type RemoveNodeOperation = ExtendedTypes<
  "RemoveNodeOperation",
  BaseRemoveNodeOperation
>;

// 合并节点,默认与将path指代的节点和path指代的节点后面一个节点合并,count代表path指代的节点具有的子节点的个数，也是为了让之后一个节点的子节点可以合并到path指代的节点的chilren数组中，更新每一个子节点具体的路径值
export type BaseMergeNodeOperation = {
  type: "merge_node";
  path: Path;
  count: number;
};
export type MergeNodeOperation = ExtendedTypes<
  "MergeNodeOperation",
  BaseMergeNodeOperation
>;

// 分割节点,count为划分点，也就是决定从path指代节点的第count个子节点开始划分
export type BaseSplitNodeOperation = {
  type: "split_node";
  path: Path;
  count: number;
};
export type SplitNodeOperation = ExtendedTypes<
  "SplitNodeOperation",
  BaseSplitNodeOperation
>;

//移动节点
export type BaseMoveNodeOperation = {
  type:"move_node";
  path:Path;
  newPath:Path;
}
export type MoveNodeOperation = ExtendedTypes<"MoveNodeOperation",BaseMoveNodeOperation>;

//对节点的操作类型
export type NodeOperation =
  | InsertNodeOperation
  | RemoveNodeOperation
  | MergeNodeOperation
  | MoveNodeOperation
  | SplitNodeOperation;

// 插入文本
export type BaseInsertTextOperation = {
  type: "insert_text";
  path: Path;
  offset: number;
  text: string;
};
export type InsertTextOperation = ExtendedTypes<
  "InsertTextOperation",
  BaseInsertTextOperation
>;

//删除文本
export type BaseRemoveTextOperation = {
  type: "remove_text";
  path: Path;
  offset: number;
  text: string;
};
export type RemoveTextOperation = ExtendedTypes<
  "RemoveTextOperation",
  BaseRemoveTextOperation
>;

//对文本的操作类型
export type TextOperation = InsertTextOperation | RemoveTextOperation;

export type Operation = NodeOperation | TextOperation;
