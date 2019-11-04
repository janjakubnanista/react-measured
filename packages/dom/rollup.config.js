import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import ts from '@wessberg/rollup-plugin-ts';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    external: ['react'],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        name: '@react-width-height/dom',
        globals: { react: 'React' },
      },
    ],
    plugins: [ts(), resolve(), commonJS()],
  },
];
