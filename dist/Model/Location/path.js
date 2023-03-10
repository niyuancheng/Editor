export const PathUtils = {
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
        const av = path[i];
        const bv = another[i];
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
                    if (direction === "forward") {
                        //do nothing
                    }
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
//# sourceMappingURL=path.js.map