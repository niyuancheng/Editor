import { PathUtils } from "./path";
import { PointUtils } from "./point";
export const RangeUtils = {
    edges(range) {
        let { from, to } = range;
        return [from, to];
    },
    end(range) {
        let { from, to } = range;
        return to;
    },
    equals(range, another) {
        return (PointUtils.equals(range.from, another.from) &&
            PointUtils.equals(range.to, another.to));
    },
    includes(range, target) {
        let { from, to } = range;
        //用自定义的类型守卫对target进行类型细化
        if (PathUtils.isPath(target)) {
            return (PathUtils.compare(from.path, target) <= 0 &&
                PathUtils.compare(to.path, target) >= 0);
        }
        else if (PointUtils.isPoint(target)) {
            return (PointUtils.compare(from, target) <= 0 &&
                PointUtils.compare(to, target) >= 0);
        }
        else if (RangeUtils.isRange(target)) {
            let { from: tFrom, to: tTo } = target;
            return (RangeUtils.includes(range, tFrom) && RangeUtils.includes(range, tTo));
        }
    },
    //intersection -- 十字路口，获取两个range的相交部分
    intersection(range, another) {
        let [s1, e1] = RangeUtils.edges(range);
        let [s2, e2] = RangeUtils.edges(another);
        let start = PointUtils.isAfter(s1, s2) ? s1 : s2;
        let end = PointUtils.isBefore(e1, e2) ? e1 : e2;
        if (PointUtils.isAfter(start, end))
            return null;
        return { from: start, to: end };
    },
    isBackward(range) {
        let [start, end] = RangeUtils.edges(range);
        return PointUtils.isAfter(start, end);
    },
    isCollapsed(range) {
        let [start, end] = RangeUtils.edges(range);
        return PointUtils.equals(start, end);
    },
    isExpanded(range) {
        return !RangeUtils.isCollapsed(range);
    },
    isForward(range) {
        return !RangeUtils.isBackward(range);
    },
    isRange(value) {
        return (value.from &&
            PointUtils.isPoint(value.from) &&
            value.to &&
            PointUtils.isPoint(value.to));
    },
    *points(range) {
        yield [range.from, "from"];
        yield [range.to, "to"];
    },
    start(range) {
        let { from } = range;
        return from;
    },
};
//# sourceMappingURL=range.js.map