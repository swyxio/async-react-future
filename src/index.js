// general export for backwards compatibility
export * from './mockapi';
export * from './future';
export * from './movieDemo';

// namespaced exports for future use
import future from './future';
import mockapi from './mockapi';
import movieDemo from './movieDemo';
export { future, mockapi, movieDemo };
