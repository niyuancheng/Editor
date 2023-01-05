import ts from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";
import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const extensions = [".ts"];
export default defineConfig([
  {
    input: "./src/index.ts", //入口

    output: [
      {
        file: "./dist/editor.cjs.js",
        format: "cjs",
      },
      {
        file: "./dist/editor.min.cjs.js",
        format: "cjs",
        plugins:[terser()]
      },
      {
        file: "./dist/editor.es.js",
        format: "es",
      },
      {
        file: "./dist/editor.min.es.js",
        format: "es",
        plugins:[terser()]
      },
      {
        file: "./dist/editor.umd.js",
        format: "umd",
        name: "Editor",
      },
      {
        file: "./dist/editor.min.umd.js",
        format: "umd",
        name: "Editor",
        plugins:[terser()]
      },
    ],

    //插件
    plugins: [
      //ts插件让rollup读取ts文件
      ts(),
      nodeResolve({
        extensions,
      }),
      babel(),
    ],
  },
]);
