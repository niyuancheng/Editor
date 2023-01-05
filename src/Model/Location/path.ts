import { ExtendedTypes } from "../../custom-types";

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
}

export const PathUtils: PathInterface = {
  isPath(value: any): value is Path {
    return (
      Array.isArray(value) &&
      value.filter((item) => {
        return typeof item !== "number";
      }).length === 0
    );
  },

  equals(path: Path, another: Path): boolean {
    for (let i in path) {
      if (path[i] !== another[i]) return false;
    }
    return path.length === another.length;
  },

  //  比较两个path的先后顺序，注意对于path = [0,0,1]和another = [0,0,1,2,3]很明显another是path的孙节点，对于此种情况返回值为0
  compare(path: Path, another: Path): -1 | 0 | 1 {
    const min = Math.min(path.length, another.length);

    for (let i = 0; i < min; i++) {
      if (path[i] < another[i]) return -1;
      if (path[i] > another[i]) return 1;
    }

    return 0;
  },
  // 获取某一个path的所有祖先
  ancestors(path: Path): Path[] {
    let result = [];
    for (let i = 0; i < path.length; i++) {
      result.push(path.slice(0, i + 1));
    }
    return result;
  },

  // 返回两者的共同的祖先路径
  common(path: Path, another: Path): Path {
    let result = [];
    let min = Math.min(path.length, another.length);
    for (let i = 0; i < min; i++) {
      if (path[i] === another[i]) result.push(path[i]);
      else break;
    }
    return result;
  },

  // 判断path是否出现在another之后
  isAfter(path: Path, another: Path): boolean {
    return this.compare(path, another) === 1;
  },

  // 判断path是否为another的祖先
  isAncestor(path: Path, another: Path): boolean {
    return path.length < another.length && this.compare(path, another) === 0;
  },

  isDescendant(path: Path, another: Path): boolean {
    return path.length > another.length && this.compare(path, another) === 0;
  },

  isChild(path: Path, another: Path): boolean {
    return (
      path.length === another.length + 1 && this.compare(path, another) === 0
    );
  },

  isBefore(path: Path, another: Path): boolean {
    return this.compare(path, another) === -1;
  },

  next(path: Path): Path | never {
    if (path.length === 0) {
      throw new Error("传入的path的数组长度不能为0");
    }

    let last = path[path.length - 1];
    return path.slice(0, path.length - 1).concat(last + 1);
  },

  before(path: Path): Path | never {
    if (path.length === 0) {
      throw new Error("传入的path的数组长度不能为0");
    }

    let last = path[path.length - 1];
    if (last === 0) {
      throw new Error("传入的path不存在前继节点");
    }
    return path.slice(0, path.length - 1).concat(last - 1);
  },
};
