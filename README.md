# async-react-future - import from the future today!

> A compilation of everything everyone is doing with Async React.

> THIS IS A HIGHLY UNSTABLE AND UNRELIABLE LIBRARY, DO NOT USE IF YOU DON'T KNOW WHAT YOU ARE DOING

This library helps people experiment with Async React as explored in talks by @swyx:

* https://slides.com/swyx/react-suspense
* https://slides.com/swyx/background-thread

If you want further hints on how to use this library, check these articles:

* https://dev.to/swyx/how-to-try-react-suspense-in-5-minutes-474c

and watch this repo: https://github.com/sw-yx/fresh-async-react.

[![NPM](https://img.shields.io/npm/v/async-react-future.svg)](https://www.npmjs.com/package/async-react-future) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## See it in action

### Simple movie demo clone - no Suspense, no react-loadable
[![Edit async-react-future simple non suspense clone](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/0po13wpz6v)

### Movie demo clone - no Suspense, with react-loadable
[![Edit async-react-future react-loadable non suspense clone](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/wn4w6ywqxw)

### Full movie demo clone - with Suspense

[![Edit async-react-future demo clone](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ryrk0o5xzm)

## Install

```bash
npm install --save async-react-future
```

## Usage

```jsx
import React, { Component, Fragment } from 'react';

import { createFetcher, Placeholder, Img, Delay } from 'async-react-future';

import { fetchMovieReviews } from './api';
const movieReviewsFetcher = createFetcher(fetchMovieReviews);

function MovieReviews({ movieId }) {
  const reviews = movieReviewsFetcher.read(movieId);
  return <div className="MovieReviews">{reviews.map(review => <div key={review}>{review}</div>)}</div>;
}

function Text(props) {
  return <span prop={props.text} />;
}

function DebouncedText({ text, ms }) {
  return (
    <Fragment>
      <Delay ms={ms} />
      <Text text={text} />
    </Fragment>
  );
}
export default class App extends Component {
  render() {
    return (
      <AsyncMode>
        <Placeholder delayMs={1000} fallback={<div className="Spinner" />}>
          <div>
            <h1>welcome to the async react future </h1>
            <MovieReviews movieId={2000} />
            <Img src="http://gifurl.com/hooray.gif" />
            <DebouncedText ms={1000} text="A" />
          </div>
        </Placeholder>
      </AsyncMode>
    );
  }
}
```

This library ships its own version of caches which you can import:

```js
import { createResource, createCache } from 'async-react-future'; // simple-cache-provider
import { load, clear, clearAll } from 'async-react-future'; // pomber/hitchcock
```

and a bunch of components:

* `<Delay />`
* `<Never />`
* `<Img />`
* `<Loading />`
* `<Component />` with `this.deferSetState()`
* `<Placeholder />`
* `createFetcher`

## Attribution

I have studied a lot of people's code and you are likely to see shades of your code pop up here and there. I don't claim any rights at all to any of this. I'll try to attribute as many people as possible but apologies in advance if I forgot to include you.

* https://github.com/BenoitZugmeyer/react-suspense-demo for much of the `./future` API
* https://medium.com/@pete_gleeson/creating-suspense-in-react-16-2-dcf4cb1a683f for `Loading`
* https://github.com/pomber/hitchcock/blob/master/src/cache.js for cache

Library was bootstrapped with: https://github.com/transitive-bullshit/create-react-library

## License

MIT © [sw-yx](https://github.com/sw-yx)
