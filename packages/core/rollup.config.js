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
        name: '@react-width-height/core',
        globals: { react: 'React' },
      },
    ],
    plugins: [ts()],
  },
];
