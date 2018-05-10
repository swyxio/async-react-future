import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';

import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins: [
      external(),
      postcss({
        modules: true
      }),
      url(),
      babel({
        runtimeHelpers: true,
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs({
        namedExports: {
          // left-hand side can be an absolute path, a path
          // relative to the current directory, or the name
          // of a module in node_modules
          'node_modules/react-is/index.js': ['isValidElementType']
        }
      })
    ]
  }
  // {
  //   input: 'src/components/index.js',
  //   output: [
  //     {
  //       file: pkg.componentdir.main,
  //       format: 'cjs'
  //     },
  //     {
  //       file: pkg.componentdir.module,
  //       format: 'es'
  //     }
  //   ],
  //   plugins: [
  //     external(),
  //     postcss({
  //       modules: true
  //     }),
  //     url(),
  //     babel({
  //       runtimeHelpers: true,
  //       exclude: 'node_modules/**'
  //     }),
  //     resolve(),
  //     commonjs()
  //   ]
  // }
];
