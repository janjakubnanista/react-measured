import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import ts from '@wessberg/rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const globals = { react: 'React', 'react-dom': 'ReactDOM', 'react-native': 'reactNative' };
const output = {
  globals,
  compact: IS_PRODUCTION,
  exports: 'named',
  sourcemap: true,
};

export default packageName => ({
  input: 'src/index.ts',
  external: ['react', 'react-dom', 'react-native', 'react-measured'],
  output: [
    {
      ...output,
      file: 'dist/index.cjs.js',
      format: 'cjs',
      name: packageName,
    },
    {
      ...output,
      file: 'dist/index.es.js',
      format: 'es',
      sourcemap: true,
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
    commonJS({
      ignoreGlobal: true,
      namedExports: {
        'react-is': ['isElement', 'isValidElementType', 'ForwardRef'],
      },
    }),
    IS_PRODUCTION ? terser({ compress: true, sourcemap: true }) : undefined,
  ],
});
