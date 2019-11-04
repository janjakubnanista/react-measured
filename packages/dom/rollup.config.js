import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    external: ['react'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
      {
        file: pkg.browser,
        format: 'umd',
        name: '@react-width-height/dom',
        globals: { react: 'React' },
      },
    ],
    plugins: [
      typescript(),
      resolve(),
      commonJS({
        include: '@react-width-height/core',
      }),
    ],
  },
];
