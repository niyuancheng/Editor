import { ExtendedTypes } from "../../custom-types";
import { Path } from "./path";
import { Point, PointEntry } from "./point";
export type BaseRange = {
    from: Point;
    to: Point;
};
export type Range = ExtendedTypes<"Range", BaseRange>;
export interface RangeInterface {
    edges: (range: Range) => [Point, Point];
    end: (range: Range) => Point;
    equals: (range: Range, another: Range) => boolean;
    includes: (range: Range, target: Path | Point | Range) => boolean;
    intersection: (range: Range, another: Range) => Range | null;
    isBackward: (range: Range) => boolean;
    isCollapsed: (range: Range) => boolean;
    isExpanded: (range: Range) => boolean;
    isForward: (range: Range) => boolean;
    isRange: (value: any) => value is Range;
    points: (range: Range) => Generator<PointEntry, void, undefined>;
    start: (range: Range) => Point;
}
export declare const RangeUtils: RangeInterface;
