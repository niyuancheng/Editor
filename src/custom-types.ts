export type NodeType = "Editor" | "Element" | "Text";
export type LocationType = "Selection" | "Range" | "Point" | "Path";
export type OperationType =
  | "InsertNodeOperation"
  | "RemoveNodeOperation"
  | "MergeNodeOperation"
  | "SplitNodeOperation"
  | "MoveNodeOperation"
  | "InsertTextOperation"
  | "RemoveTextOperation";
export type ExtendableTypes = NodeType | LocationType | OperationType;

export interface CustomType {
  [props: string]: unknown;
}

export type ExtendedTypes<
  T extends ExtendableTypes,
  B
> = unknown extends CustomType[T] ? B : CustomType[T];
