import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import ts from '@wessberg/rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

console.warn('IS_PRODUCTION', IS_PRODUCTION);

export default packageName => ({
  input: 'src/index.ts',
  external: ['react'],
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      name: packageName,
      globals: { react: 'React' },
      compact: IS_PRODUCTION,
    },
  ],
  plugins: [ts(), resolve(), commonJS(), IS_PRODUCTION ? terser() : undefined],
});
