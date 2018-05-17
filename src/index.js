// general export for backwards compatibility
export * from './mockapi';
export * from './future';
export * from './movieDemo';

// namespaced exports for future use
const future = require('./future');
const mockapi = require('./mockapi');
const movieDemo = require('./movieDemo');
export { future, mockapi, movieDemo };
