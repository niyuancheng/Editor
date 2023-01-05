import { ExtendedTypes } from "../../custom-types";
import { Path, PathUtils } from "./path";
import { Point, PointEntry, PointUtils } from "./point";

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

export const RangeUtils: RangeInterface = {
  edges(range: Range): [Point, Point] {
    let { from, to } = range;
    return [from, to];
  },

  end(range: Range): Point {
    let { from, to } = range;
    return to;
  },

  equals(range: Range, another: Range): boolean {
    return (
      PointUtils.equals(range.from, another.from) &&
      PointUtils.equals(range.to, another.to)
    );
  },

  includes(range: Range, target: Path | Point | Range): boolean {
    let { from, to } = range;
    //用自定义的类型守卫对target进行类型细化
    if (PathUtils.isPath(target)) {
      return (
        PathUtils.compare(from.path, target) <= 0 &&
        PathUtils.compare(to.path, target) >= 0
      );
    } else if (PointUtils.isPoint(target)) {
      return (
        PointUtils.compare(from, target) <= 0 &&
        PointUtils.compare(to, target) >= 0
      );
    } else if (RangeUtils.isRange(target)) {
      let { from: tFrom, to: tTo } = target;
      return (
        RangeUtils.includes(range, tFrom) && RangeUtils.includes(range, tTo)
      );
    }
  },

  //intersection -- 十字路口，获取两个range的相交部分
  intersection(range: Range, another: Range): Range | null {
    let [s1, e1] = RangeUtils.edges(range);
    let [s2, e2] = RangeUtils.edges(another);

    let start = PointUtils.isAfter(s1, s2) ? s1 : s2;
    let end = PointUtils.isBefore(e1, e2) ? e1 : e2;

    if (PointUtils.isAfter(start, end)) return null;
    return { from: start, to: end };
  },

  isBackward(range: Range): boolean {
    let [start, end] = RangeUtils.edges(range);

    return PointUtils.isAfter(start, end);
  },

  isCollapsed(range: Range): boolean {
    let [start, end] = RangeUtils.edges(range);

    return PointUtils.equals(start, end);
  },

  isExpanded(range: Range): boolean {
    return !RangeUtils.isCollapsed(range);
  },

  isForward(range: Range): boolean {
    return !RangeUtils.isBackward(range);
  },

  isRange(value: any): value is Range {
    return (
      value.from &&
      PointUtils.isPoint(value.from) &&
      value.to &&
      PointUtils.isPoint(value.to)
    );
  },

  *points(range: Range): Generator<PointEntry, void, undefined> {
    yield [range.from, "from"];
    yield [range.to, "to"];
  },

  start(range: Range): Point {
    let { from } = range;
    return from;
  },
};
