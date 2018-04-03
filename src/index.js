/**
 * @class ExampleComponent
 */

import React, { Timeout } from "react";
import { unstable_deferredUpdates as deferredUpdates } from "react-dom";
// import PropTypes from "prop-types";
//https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
// cant do named importing because SCP is written in cjs...
import SCP from "simple-cache-provider";
const { createResource, createCache } = SCP;
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
