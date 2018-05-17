// this is a non flow typed rewrite of simple-cache-provider so that we can mess around with it in future
// also good for teaching people who don't read flow
//
// adapted from
// https://github.com/facebook/react/blob/master/packages/simple-cache-provider/src/SimpleCacheProvider.js

import React from 'react';

function noop() {}

const EMPTY = 0;
const PENDING = 1;
const RESOLVED = 2;
const REJECTED = 3;

export function createCache(invalidator) {
  const resourceCache = new Map();
  function getRecord(resourceType, key) {
    let recordCache = resourceCache.get(resourceType);
    if (recordCache !== undefined) {
      const record = recordCache.get(key);
      if (record !== undefined) {
        return record;
      }
    } else {
      recordCache = new Map();
      resourceCache.set(resourceType, recordCache);
    }
    const record = {
      status: EMPTY,
      suspender: null,
      value: null,
      error: null
    };
    recordCache.set(key, record);
    return record;
  }
  function load(emptyRecord, suspender) {
    const pendingRecord = emptyRecord;
    pendingRecord.status = PENDING;
    pendingRecord.suspender = suspender;
    suspender.then(
      value => {
        // Resource loaded successfully.
        const resolvedRecord = pendingRecord;
        resolvedRecord.status = RESOLVED;
        resolvedRecord.suspender = null;
        resolvedRecord.value = value;
      },
      error => {
        // Resource failed to load. Stash the error for later so we can throw it
        // the next time it's requested.
        const rejectedRecord = pendingRecord;
        rejectedRecord.status = REJECTED;
        rejectedRecord.suspender = null;
        rejectedRecord.error = error;
      }
    );
  }
  const cache = {
    invalidate() {
      invalidator();
    },
    preload(resourceType, key, miss, missArg) {
      const record = getRecord(resourceType, key);
      switch (record.status) {
        case EMPTY:
          // Warm the cache.
          const suspender = miss(missArg);
          load(record, suspender);
          return;
        case PENDING:
          // There's already a pending request.
          return;
        case RESOLVED:
          // The resource is already in the cache.
          return;
        case REJECTED:
          // The request failed.
          return;
      }
    },
    read(resourceType, key, miss, missArg) {
      const record = getRecord(resourceType, key);
      switch (record.status) {
        case EMPTY:
          // Load the requested resource.
          const suspender = miss(missArg);
          load(record, suspender);
          throw suspender; // woot
        case PENDING:
          // There's already a pending request.
          throw record.suspender;
        case RESOLVED:
          return record.value;
        case REJECTED:
        default:
          // The requested resource previously failed loading.
          const error = record.error;
          throw error;
      }
    }
  };
  return cache;
}

export function createResource(loadResource, hash) {
  const resource = {
    read(cache, key) {
      if (hash === undefined) {
        return cache.read(resource, key, loadResource, key);
      }
      const hashedKey = hash(key);
      return cache.read(resource, hashedKey, loadResource, key);
    },
    preload(cache, key) {
      if (hash === undefined) {
        cache.preload(resource, key, loadResource, key);
        return;
      }
      const hashedKey = hash(key);
      cache.preload(resource, hashedKey, loadResource, key);
    }
  };
  return resource;
}

// Global cache has no eviction policy (except for, ya know, a browser refresh).
const globalCache = createCache(noop);
export const SimpleCache = React.createContext(globalCache);

// // https://github.com/pomber/hitchcock/blob/master/src/cache.js

const cache = new Map();

function getRecord(key) {
  let record = cache.get(key);
  if (record === undefined) {
    record = {
      key,
      status: EMPTY
    };
    cache.set(key, record);
  }
  return record;
}

const noopSpy = {
  willResolve: record => value => value,
  didResolve: record => value => value,
  didStart: record => null,
  didClear: record => null,
  didClearAll: record => null
};

export function load({ key, getValue }, spy = noopSpy) {
  const record = getRecord(key);
  if (record.status === RESOLVED) {
    // console.log(key + " already resolved");
    return record.value;
  } else if (record.status === EMPTY) {
    // console.log(key + " is new");
    record.status = PENDING;
    record.suspender = getValue()
      .then(value => new Promise(resolve => resolve(value)))
      .then(spy.willResolve(record))
      .then(value => {
        // console.log(key + " is ready");
        record.status = RESOLVED;
        record.suspender = null;
        record.value = value;
        return value;
      })
      .then(spy.didResolve(record));
    spy.didStart(record);
  }
  // console.log(key + " is pending");
  throw record.suspender;
}

export function clear(key, spy = noopSpy) {
  let record = cache.get(key);
  if (record !== undefined) {
    cache.delete(key);
    spy.didClear(record);
  }
}

export function clearAll(spy = noopSpy) {
  cache.clear();
  spy.didClearAll();
}

// export default {
//   load,
//   clear,
//   clearAll
// };
