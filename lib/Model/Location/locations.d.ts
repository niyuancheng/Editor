import { Path, Point, Range } from "../../index";
export type Location = Path | Point | Range;
export interface LocationInterface {
    isLocation: (value: any) => value is Location;
}
export declare const LocationUtils: LocationInterface;
