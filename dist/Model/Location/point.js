import { PathUtils } from "./path";
export const PointUtils = {
    compare(point, another) {
        let result = PathUtils.compare(point.path, another.path);
        if (result === 0) {
            if (point.offset > another.offset)
                return 1;
            if (point.offset < another.offset)
                return -1;
            return 0;
        }
        return result;
    },
    isAfter(point, another) {
        return this.compare(point, another) === 1;
    },
    isBefore(point, another) {
        return this.compare(point, another) === -1;
    },
    equals(point, another) {
        return (PathUtils.equals(point.path, another.path) &&
            point.offset === another.offset);
    },
    isPoint(value) {
        return (value.path &&
            value.offset &&
            PathUtils.isPath(value.path) &&
            typeof value.offset === "number");
    },
};
//# sourceMappingURL=point.js.map