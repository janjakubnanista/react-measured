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
        name: '@react-width-height/core',
        globals: { react: 'React' },
      },
    ],
    plugins: [typescript()],
  },
];
