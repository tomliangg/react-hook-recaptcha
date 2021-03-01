import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

export default {
  input: "src/useRecaptcha.js",
  output: [
    {
      file: pkg.main,
      format: "iife",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    nodeResolve({
      extensions: [".js", ".jsx"],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' ),
      preventAssignment: true,
    }),
    babel({
      presets: ["@babel/preset-react"],
    }),
    commonjs(),
  ]
};