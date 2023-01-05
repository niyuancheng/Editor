export type NodeType = "Editor" | "Element" | "Text";
export type LocationType = "Range" | "Point" | "Path";

export type ExtendableTypes = NodeType | LocationType;

export interface CustomType {
  [props: string]: unknown;
}

export type ExtendedTypes<
  T extends ExtendableTypes,
  B
> = unknown extends CustomType[T] ? B : CustomType[T];
