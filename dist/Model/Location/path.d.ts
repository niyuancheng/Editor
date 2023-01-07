import { ExtendedTypes } from "../../custom-types";
import { Operation } from "../Operation/operation";
import { PathTransformOptions } from "../../types/index";
export type BasePath = number[];
export type Path = ExtendedTypes<"Text", BasePath>;
export interface PathInterface {
    isPath: (value: any) => value is Path;
    equals: (path: Path, another: Path) => boolean;
    compare: (path: Path, another: Path) => -1 | 0 | 1;
    ancestors: (path: Path) => Path[];
    common: (path: Path, another: Path) => Path;
    isAfter: (path: Path, another: Path) => boolean;
    isBefore: (path: Path, another: Path) => boolean;
    isAncestor: (path: Path, another: Path) => boolean;
    isDescendant: (path: Path, another: Path) => boolean;
    isChild: (path: Path, another: Path) => boolean;
    next: (path: Path) => Path | never;
    before: (path: Path) => Path | never;
    endsAfter: (path: Path, another: Path) => boolean;
    endsAt: (path: Path, another: Path) => boolean;
    endsBefore: (path: Path, another: Path) => boolean;
    transform: (path: Path, operation: Operation, options?: PathTransformOptions) => Path | null;
}
export declare const PathUtils: PathInterface;
