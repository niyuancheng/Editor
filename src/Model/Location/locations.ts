import { Path,PathUtils,Point,PointUtils,Range, RangeUtils } from "../../index"

export type Location = Path | Point | Range;

export interface LocationInterface {
    isLocation:(value:any)=>value is Location;
}

export const LocationUtils: LocationInterface = {
    isLocation(value: any): value is Location {
        return PathUtils.isPath(value) || PointUtils.isPoint(value) || RangeUtils.isRange(value);
    }
}