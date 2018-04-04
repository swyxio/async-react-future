/**
 * @class ExampleComponent
 */

import React, { Timeout } from "react";
import { unstable_deferredUpdates as deferredUpdates } from "react-dom";
// export * from "./hitchcock";
// import PropTypes from "prop-types";
//https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
// cant do named importing because SCP is written in cjs...
// import SCP from "simple-cache-provider";
// const { createResource, createCache } = SCP;
export { createResource, createCache, load, clear, clearAll } from "./cache";

const cache = createCache(() => {});

/// exported API
export function createFetcher(resolver) {
  const resource = createResource(resolver);
  return {
    read: key => resource.read(cache, key)
  };
}

export function Placeholder(props) {
  return <Timeout ms={props.delayMs}>{didExpire => (didExpire ? props.fallback : props.children)}</Timeout>;
}

export class Component extends React.Component {
  deferSetState(state) {
    deferredUpdates(() => this.setState(state));
  }
}

export class Loading extends React.Component {
  state = { isLoading: false };
  componentDidCatch(fetcher) {
    fetcher.then(() => this.setState({ isLoading: false }));
    this.setState({ isLoading: true });
  }
  render() {
    return this.props.children(this.state.isLoading);
  }
}

const imageFetcher = createFetcher(
  src =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(src);
      image.onerror = reject;
      image.src = src;
    })
);

export function Img(props) {
  return <img {...props} src={imageFetcher.read(props.src)} />;
}

// https://github.com/acdlite/react/blob/7166ce6d9b7973ddd5e06be9effdfaaeeff57ed6/packages/react-reconciler/src/__tests__/ReactSuspense-test.js#L558
export function Never() {
  // Throws a promise that resolves after some arbitrarily large
  // number of seconds. The idea is that this component will never
  // resolve. It's always wrapped by a Timeout.
  throw new Promise(resolve => setTimeout(() => resolve(), 10000));
}

export function Delay({ ms }) {
  return (
    <Timeout ms={ms}>
      {didTimeout => {
        if (didTimeout) {
          // Once ms has elapsed, render null. This allows the rest of the
          // tree to resume rendering.
          return null;
        }
        return <Never />;
      }}
    </Timeout>
  );
}
