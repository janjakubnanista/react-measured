import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import ts from '@wessberg/rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export default packageName => ({
  input: 'src/index.ts',
  external: ['react', 'react-native'],
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      name: packageName,
      globals: { react: 'React' },
      compact: IS_PRODUCTION,
    },
  ],
  plugins: [
    ts({
      transpiler: 'babel',
      babelConfig: '../../babel.config.js',
    }),
    resolve({
      browser: true,
    }),
    commonJS(),
    IS_PRODUCTION ? terser() : undefined,
  ],
});
