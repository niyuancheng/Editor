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
    transform(point, operation, options = {}) {
        const { type, path: op } = operation;
        let p = Object.assign({}, point);
        switch (type) {
            case "move_node":
            case "insert_node":
                p.path = PathUtils.transform(p.path, operation, options);
                break;
            case "merge_node":
                p.path = PathUtils.transform(p.path, operation, options);
                if (PathUtils.equals(p.path, op)) {
                    p.offset += operation.count;
                }
                break;
            case "split_node":
                p.path = PathUtils.transform(p.path, operation, options);
                if (PathUtils.equals(p.path, op) && p.offset >= operation.count) {
                    p.offset -= operation.count;
                }
                break;
            case "remove_node":
                if (PathUtils.equals(p.path, op) || PathUtils.isAncestor(op, p.path)) {
                    return null;
                }
                PathUtils.transform(p.path, operation, options);
                break;
            case "insert_text":
                if (PathUtils.equals(p.path, op) && p.offset >= operation.offset) {
                    p.offset += operation.text.length;
                }
                break;
            // 删除文本：指的是在指定从偏移量为offset的后面数text.length个字符进行删除
            case "remove_text":
                if (PathUtils.equals(p.path, op)) {
                    if (p.offset > operation.offset) {
                        if (p.offset - operation.offset < operation.text.length)
                            return null;
                        p.offset -= operation.text.length;
                    }
                }
                break;
        }
        return p;
    },
};
//# sourceMappingURL=point.js.map