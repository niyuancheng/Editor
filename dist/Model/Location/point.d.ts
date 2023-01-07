import { ExtendedTypes } from "../../custom-types";
import { Path } from "./path";
import { PointTransformOptions } from "../../types";
import { Operation } from "../Operation/operation";
export type BasePoint = {
    path: Path;
    offset: number;
};
export type Point = ExtendedTypes<"Point", BasePoint>;
export type PointEntry = [Point, 'from' | 'to'];
export interface PointInterface {
    compare: (point: Point, another: Point) => -1 | 0 | 1;
    isAfter: (point: Point, another: Point) => boolean;
    isBefore: (point: Point, another: Point) => boolean;
    equals: (point: Point, another: Point) => boolean;
    isPoint: (value: any) => value is Point;
    transform: (point: Point, operation: Operation, options?: PointTransformOptions) => Point | null;
}
export declare const PointUtils: PointInterface;
