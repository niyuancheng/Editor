import { ExtendedTypes } from "../../custom-types";
import { Path, PathUtils } from "./path";
import { PointTransformOptions } from "../../types";
import { Operation } from "../Operation/operation";

export type BasePoint = {
  path: Path;
  offset: number;
};

export type Point = ExtendedTypes<"Point", BasePoint>;

export type PointEntry = [Point, 'from' | 'to']

export interface PointInterface {
  compare: (point: Point, another: Point) => -1 | 0 | 1;
  isAfter: (point: Point, another: Point) => boolean;
  isBefore: (point: Point, another: Point) => boolean;
  equals: (point: Point, another: Point) => boolean;
  isPoint: (value: any) => value is Point;
  transform: (point: Point, operation: Operation ,options?: PointTransformOptions) => Point | null;
}

export const PointUtils: PointInterface = {
  compare(point: Point, another: Point): -1 | 0 | 1 {
    let result = PathUtils.compare(point.path, another.path);

    if (result === 0) {
      if (point.offset > another.offset) return 1;
      if (point.offset < another.offset) return -1;
      return 0;
    }
    return result;
  },
  isAfter(point: Point, another: Point): boolean {
    return this.compare(point, another) === 1;
  },
  isBefore(point: Point, another: Point): boolean {
    return this.compare(point, another) === -1;
  },
  equals(point: Point, another: Point): boolean {
    return (
      PathUtils.equals(point.path, another.path) &&
      point.offset === another.offset
    );
  },
  isPoint(value: any): value is Point {
    return (
      value.path &&
      value.offset &&
      PathUtils.isPath(value.path) &&
      typeof value.offset === "number"
    );
  },

  transform(point:Point, operation:Operation, options:PointTransformOptions = {}): Point | null {
    return null;
  },
};
