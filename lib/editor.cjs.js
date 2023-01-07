'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const PathUtils = {
    isPath(value) {
        return (Array.isArray(value) &&
            value.filter((item) => {
                return typeof item !== "number";
            }).length === 0);
    },
    equals(path, another) {
        for (let i in path) {
            if (path[i] !== another[i])
                return false;
        }
        return path.length === another.length;
    },
    //  比较两个path的先后顺序，注意对于path = [0,0,1]和another = [0,0,1,2,3]很明显another是path的孙节点，对于此种情况返回值为0
    compare(path, another) {
        const min = Math.min(path.length, another.length);
        for (let i = 0; i < min; i++) {
            if (path[i] < another[i])
                return -1;
            if (path[i] > another[i])
                return 1;
        }
        return 0;
    },
    // 获取某一个path的所有祖先
    ancestors(path) {
        let result = [];
        for (let i = 0; i < path.length; i++) {
            result.push(path.slice(0, i + 1));
        }
        return result;
    },
    // 返回两者的共同的祖先路径
    common(path, another) {
        let result = [];
        let min = Math.min(path.length, another.length);
        for (let i = 0; i < min; i++) {
            if (path[i] === another[i])
                result.push(path[i]);
            else
                break;
        }
        return result;
    },
    // 判断path是否出现在another之后
    isAfter(path, another) {
        return this.compare(path, another) === 1;
    },
    // 判断path是否为another的祖先
    isAncestor(path, another) {
        return path.length < another.length && this.compare(path, another) === 0;
    },
    isDescendant(path, another) {
        return path.length > another.length && this.compare(path, another) === 0;
    },
    isChild(path, another) {
        return (path.length === another.length + 1 && this.compare(path, another) === 0);
    },
    isBefore(path, another) {
        return this.compare(path, another) === -1;
    },
    next(path) {
        if (path.length === 0) {
            throw new Error("传入的path的数组长度不能为0");
        }
        let last = path[path.length - 1];
        return path.slice(0, path.length - 1).concat(last + 1);
    },
    before(path) {
        if (path.length === 0) {
            throw new Error("传入的path的数组长度不能为0");
        }
        let last = path[path.length - 1];
        if (last === 0) {
            throw new Error("传入的path不存在前继节点");
        }
        return path.slice(0, path.length - 1).concat(last - 1);
    },
    //ends系列函数和is系列函数的不同点是path和another两个路径具有共同的父节点（该处的父节点指的是path的父节点）
    endsAfter(path, another) {
        const i = path.length - 1;
        const as = path.slice(0, i);
        const bs = another.slice(0, i);
        const av = path[i];
        const bv = another[i];
        return this.equals(as, bs) && av > bv;
    },
    endsBefore(path, another) {
        const i = path.length - 1;
        const as = path.slice(0, i);
        const bs = another.slice(0, i);
        const av = path[i];
        const bv = another[i];
        return this.equals(as, bs) && av < bv;
    },
    endsAt(path, another) {
        const i = path.length - 1;
        const as = path.slice(0, i);
        const bs = another.slice(0, i);
        path[i];
        another[i];
        return this.equals(as, bs);
    },
    transform(path, operation, options = {}) {
        let p = [...path];
        let { path: op } = operation;
        let { direction = "forward" } = options;
        switch (operation.type) {
            case "insert_node":
                if (this.isAncestor(op, p) ||
                    this.endsBefore(op, p) ||
                    this.equals(p, op) ||
                    this.isBefore(op, p)) {
                    p[op.length - 1]++;
                }
                break;
            case "remove_node":
                if (this.endsAfter(p, op) || this.isAfter(p, op)) {
                    p[op.length]--;
                }
                else if (this.equals(p, op) || this.isAncestor(op, p)) {
                    return null;
                }
                break;
            //合并节点，默认与将path指代的节点和path指代的节点前面一个节点合并
            case "merge_node":
                if (this.equals(op, p) ||
                    this.endsBefore(op, p) ||
                    this.isBefore(op, p)) {
                    p[op.length - 1]--;
                }
                else if (this.isAncestor(op, p)) {
                    p[op.length - 1]--;
                    p[op.length] += operation.count;
                }
                break;
            case "split_node":
                if (this.equals(op, p)) {
                    if (direction === "forward") ;
                    else {
                        p[p.length - 1]++;
                    }
                }
                else if (this.endsBefore(op, p) || this.isBefore(op, p)) {
                    p[op.length - 1]++;
                }
                else if (this.isAncestor(op, p)) {
                    if (p[op.length] >= operation.count) {
                        p[op.length - 1]++;
                        p[op.length] -= operation.count;
                    }
                }
                break;
            case "move_node":
                let { newPath: new_op } = operation;
                if (this.equals(op, new_op))
                    return null;
                //1. 首先判断op和p之间的关系
                if (this.equals(op, p)) {
                    if (this.endsAfter(new_op, op) && new_op.length > op.length) {
                        new_op[op.length]--;
                    }
                    p = new_op;
                }
                else if (this.isAncestor(op, p)) {
                    if (this.endsAfter(new_op, op) && new_op.length > op.length) {
                        new_op[op.length]--;
                    }
                    p = new_op.concat(p.slice(op.length, p.length));
                }
                else if (this.endsBefore(op, p)) {
                    p[op.length - 1]--;
                    if (this.endsBefore(new_op, p) || this.equals(new_op, p)) {
                        p[new_op.length - 1]++;
                    }
                }
                else {
                    // 2.接着开始判断new_op和p之间的关系
                    if (this.endsBefore(new_op, p)) {
                        p[new_op.length - 1]++;
                    }
                    else if (this.equals(new_op, p)) {
                        p[p.length - 1]++;
                    }
                }
                break;
        }
        return p;
    },
};

const PointUtils = {
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

const RangeUtils = {
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

const LocationUtils = {
    isLocation(value) {
        return PathUtils.isPath(value) || PointUtils.isPoint(value) || RangeUtils.isRange(value);
    }
};

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}
function isPlainObject(o) {
  var ctor, prot;
  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

const TextUtils = {
    isText(value) {
        return isPlainObject(value) && value.text && typeof value.text === "string";
    },
    equals(text, another) {
        return text.text === another.text;
    },
    isTextList(value) {
        return (Array.isArray(value) &&
            value.filter((item) => {
                return !this.isText(item);
            }).length === 0);
    },
    matches(text, props) {
        for (const key in props) {
            if (key === "text")
                continue;
            if (!text.hasOwnProperty(key) || text[key] !== props[key])
                return false;
        }
        return true;
    },
    /**
     * Get the leaves for a text node given decorations.
     */
    decorations(node, decorations) {
        let leaves = [Object.assign({}, node)];
        for (let desc of decorations) {
            let { from: start, to: end } = desc;
            let next = [];
            let leafEnd = 0;
            for (let leaf of leaves) {
                let { text } = leaf;
                let leafStart = leafEnd;
                leafEnd += text.length;
                // 1.Range完全超出了字符串的范围
                if (end.offset <= leafStart || start.offset >= leafEnd) {
                    next.push(leaf);
                    continue;
                }
                // 2.Range完全覆盖字符串
                if (start.offset <= leafStart && end.offset >= leafEnd) {
                    next.push(leaf);
                    continue;
                }
                // 3.有部分相交,但字符串没有完全包含Range
                if ((start.offset <= leafStart &&
                    end.offset < leafEnd &&
                    end.offset > leafStart) ||
                    (start.offset > leafStart &&
                        start.offset < leafEnd &&
                        end.offset >= leafEnd)) {
                    let s = start.offset <= leafStart ? leafStart : start.offset;
                    let e = end.offset >= leafEnd ? leafEnd : end.offset;
                    next.push(text.slice(s, e));
                    if (s === leafStart) {
                        next.push(text.slice(e, leafEnd));
                    }
                    else if (e === leafEnd) {
                        next.push(text.slice(leafStart, s));
                    }
                    continue;
                }
                // 4.字符串完全包含了Range
                let s = start.offset;
                let e = end.offset;
                next.push(text.slice(leafStart, s));
                next.push(text.slice(s, e));
                next.push(text.slice(e, leafEnd));
            }
            leaves = next;
        }
        return leaves;
    },
};

const ElementUtils = {
    isElement(value) {
        return (isPlainObject(value) &&
            Array.isArray(value.children) &&
            value.children.filter((child) => {
                return !TextUtils.isText(child) && !ElementUtils.isElement(child);
            }).length === 0 &&
            typeof value.type === "string");
    },
    isElementList(value) {
        return (Array.isArray(value) &&
            value.every((child) => {
                return this.isElement(child);
            }));
    },
    isElementProps(props) {
        return (props.children !== undefined &&
            props.type !== undefined);
    },
    isElementType(value, elementVal, elementKey = "type") {
        return this.isElement(value) && value[elementKey] === elementVal;
    },
    matches(element, props) {
        for (const key in props) {
            if (key === "children" || key === "type")
                continue;
            if (element.hasOwnProperty(key) && element[key] === props[key])
                continue;
            return false;
        }
        return true;
    },
};

const EditorUtils = {};

exports.EditorUtils = EditorUtils;
exports.ElementUtils = ElementUtils;
exports.LocationUtils = LocationUtils;
exports.PathUtils = PathUtils;
exports.PointUtils = PointUtils;
exports.RangeUtils = RangeUtils;
exports.TextUtils = TextUtils;
