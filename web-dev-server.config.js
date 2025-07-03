/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { legacyPlugin } from '@web/dev-server-legacy';
import { rollupAdapter } from '@web/dev-server-rollup';
import replace from '@rollup/plugin-replace';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

export default {
  appIndex: 'index.html',
  watch: true,
  nodeResolve: { exportConditions: mode === 'dev' ? ['development'] : [] },
  preserveSymlinks: true,
  plugins: [
    legacyPlugin({
      polyfills: {
        webcomponents: false,
      },
    }),
    rollupAdapter(
      replace({
        'process.env.NODE_ENV': JSON.stringify(
          mode === 'dev' ? 'development' : 'production'
        ),
        preventAssignment: true,
      })
    ),
  ],
};
