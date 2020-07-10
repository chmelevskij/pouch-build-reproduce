import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import globals from "rollup-plugin-node-globals";
import builtins from "rollup-plugin-node-builtins";
import { terser } from "rollup-plugin-terser";

const dev = process.env.NODE_ENV === 'development';

export default [
  // this ends up having `events` as unresolved dependency
  {
    input: "index.js",
    output: {
      file: "build/no-events.js",
      format: "esm"
    },
    plugins: [
      resolve({
        browser: true
      }),
      commonjs(),
      !dev && terser({ module: true }),
    ]
  },

  // this works only if `events` is installed,
  // but `node_modules/pouchdb/lib/index-browser.es.js has `global`
  // which is `undefined` in the browser, but in repository
  // build it uses `self` ¯\_(ツ)_/¯. Maybe worth changing
  // `global` to `globalThis`:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
  {
    input: "index.js",
    output: {
      file: "build/global-issue.js",
      format: "esm"
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      !dev && terser({ module: true }),
    ]
  },

  // this is the only option which works correctly,
  // adds few kb for the global placeholders etc.
  {
    input: "index.js",
    output: {
      file: "build/node-helpers.js",
      format: "esm"
    },
    plugins: [
      resolve({
        browser: true
      }),
      commonjs(),
      globals(),
      builtins(),
      !dev && terser({ module: true }),
    ]
  }
];
