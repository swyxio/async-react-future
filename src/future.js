import React, { Timeout } from 'react';
import ReactDOM, { unstable_deferredUpdates as deferredUpdates } from 'react-dom';
//https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
// cant do named importing because SCP is written in cjs...
// import SCP from "simple-cache-provider";
// const { createResource, createCache } = SCP;
import { createResource, createCache, load, clear, clearAll } from './cache';

// singleton cache here, we may have to change this in future
const cache = createCache(() => {});

/// exported API
/*
 *  createFetcher function from simple-cache-provider
 *
 *  this createFetcher hooks you into the singleton cache that is run in this library
 *
 */
export function createFetcher(resolver) {
  const resource = createResource(resolver);
  return {
    read: key => resource.read(cache, key)
  };
}

/*
 *  Placeholder component from Dan's demo
 *
 *  This is a simple wrapper for Timeout; frankly if you know Timeout well you don't have to use this.
 *  You want one of these above any suspending you're going to do.
 *
 */
export function Placeholder(props) {
  const {
    delayMs = 1, // note that react has hardcorded expirations at 1s and 5s
    fallback = 'Loading', // any jsx here will do
    children // required
  } = props;
  return <Timeout ms={delayMs}>{didExpire => (didExpire ? fallback : children)}</Timeout>;
}

/*
 *  new React.Component from Dan's demo
 *
 *  Just adds deferSetState which passes things through ReactDom.deferredUpdates before setting component state
 *
 */
export class Component extends React.Component {
  deferSetState(state) {
    deferredUpdates(() => this.setState(state));
  }
}

/*
 *  LowPriority component from Peggy's ReactEurope demo
 *
 *  Defers (makes low priority) prop changes to its children through manipulating a `value` prop on a `stateKey`.
 *  from https://github.com/peggyrayzis/react-europe-apollo
 */
export class LowPriority extends React.Component {
  state = {
    [this.props.stateKey]: this.props.value // required
  };
  deferSetState(state) {
    ReactDOM.unstable_deferredUpdates(() => {
      this.setState(state);
    });
  }
  componentDidMount() {
    this.deferSetState((state, props) => ({ [props.stateKey]: props.value }));
  }
  componentDidUpdate() {
    if (this.props.value !== this.state[this.props.stateKey]) {
      this.deferSetState((state, props) => ({ [props.stateKey]: props.value }));
    }
  }
  render() {
    return this.props.children(this.state[this.props.stateKey]);
  }
}

/*
 *  Loading component from Dan's demo
 *
 *  Catches a suspender and resolves it, exposing an isLoading boolean while it is resolving.
 *  No props required.
 *
 */
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

/*
 *  Img component from Dan's demo
 *
 *  Suspends image fetching. pretty much.
 *
 */
const imageFetcher = createFetcher(
  src =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(src);
      // alternatively,
      // image.onload = () => setTimeout(() => resolve(src), 0);
      image.onerror = reject;
      image.src = src;
    })
);
export function Img(props) {
  const {
    src, // required
    alt = '', // probably required
    ...rest
  } = props;
  return <img {...rest} alt={alt} src={imageFetcher.read(src)} />;
}

/*
 *  Never component from Suspense test
 *
 *  Throws a promise that resolves after some arbitrarily large
 *  number of seconds. The idea is that this component will never
 *  resolve. It's always wrapped by a Timeout.
 *
 *  https://github.com/acdlite/react/blob/7166ce6d9b7973ddd5e06be9effdfaaeeff57ed6/packages/react-reconciler/src/__tests__/ReactSuspense-test.js#L558
 */
export function Never() {
  throw new Promise(resolve => setTimeout(() => resolve(), 10000));
}

/*
 *  Delay component from Suspense test
 *
 *  Delay a render of peer components by `ms` milliseconds. Can be used to debounce, for example.
 *
 *  Once ms has elapsed, render null. This allows the rest of the
 *  tree to resume rendering.
 *
 *  https://github.com/acdlite/react/blob/7166ce6d9b7973ddd5e06be9effdfaaeeff57ed6/packages/react-reconciler/src/__tests__/ReactSuspense-test.js#L558
 */
export function Delay({
  ms // required number
}) {
  return (
    <Timeout ms={ms}>
      {didTimeout => {
        if (didTimeout) {
          return null;
        }
        return <Never />;
      }}
    </Timeout>
  );
}
