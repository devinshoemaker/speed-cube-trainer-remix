const { flatRoutes } = require('remix-flat-routes');

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: './node_modules/.cache/remix',
  // ignoredRouteFiles: ['**/.*', '**/*.test.{ts,tsx}'],
  serverModuleFormat: 'cjs',
  ignoredRouteFiles: ['**/*'],
  routes: async (defineRoutes) => {
    return flatRoutes('routes', defineRoutes);
  }
};
