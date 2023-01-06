import { PathUtils, PointUtils, RangeUtils } from "../../index";
export const LocationUtils = {
    isLocation(value) {
        return PathUtils.isPath(value) || PointUtils.isPoint(value) || RangeUtils.isRange(value);
    }
};
//# sourceMappingURL=locations.js.map