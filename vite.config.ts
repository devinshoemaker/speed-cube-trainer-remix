import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { flatRoutes } from 'remix-flat-routes';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

installGlobals();

export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    remix({
      // cacheDirectory: './node_modules/.cache/remix',
      // ignoredRouteFiles: ['**/.*', '**/*.test.{ts,tsx}'],
      serverModuleFormat: 'cjs',
      ignoredRouteFiles: ['**/*'],
      routes: async (defineRoutes) => {
        return flatRoutes('routes', defineRoutes);
      }
    }),
    tsconfigPaths()
  ]
});
