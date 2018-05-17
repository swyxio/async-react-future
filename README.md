# async-react-future - import \* from './future' today!

> A compilation of everything everyone is doing with Async React, for easy demoing and experimentation.

> WARNING: THIS IS NOT TO BE USED FOR PRODUCTION

This library helps people experiment with Async React as explored [by the community](https://github.com/sw-yx/fresh-async-react).

[![NPM](https://img.shields.io/npm/v/async-react-future.svg)](https://www.npmjs.com/package/async-react-future)

## See it in action

<details>

<summary>Non Suspense Demo Clones
</summary>

### Simple movie demo clone - no Suspense, no react-loadable

[![Edit async-react-future simple non suspense clone](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/0po13wpz6v)

### Movie demo clone - no Suspense, with react-loadable

[![Edit async-react-future react-loadable non suspense clone](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/wn4w6ywqxw)

</details>

### Full movie demo clone - with Suspense

[![Edit async-react-future demo clone](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ryrk0o5xzm)

---

## Install

```bash
npm install --save async-react-future
```

## API Documentation

Note: all of the below must be used inside ReactDOM's coming `<AsyncMode>`.

### `./future`

Dan Movie Demo Components

<details>

<summary>Placeholder</summary>

> Placeholder component from Dan's demo

This is a simple wrapper for Timeout; frankly if you know Timeout well you don't have to use this.

You want one of these above any suspending you're going to do.

#### Props

```js
const {
  delayMs = 1, // note that react has hardcorded expirations at 1s and 5s
  fallback = 'Loading', // any jsx here will do
  children // required
} = props;
```

#### Usage Example

```js
import { future: { Placeholder } } from 'async-react-future';

// later...
 <Placeholder delayMs={1000} fallback={<div className="Spinner" />}>
   {/* stuff with suspenders in here */}
 </Placeholder>
```

</details>

<details>

<summary>Component</summary>

> new React.Component from Dan's demo

Just adds deferSetState to React.Component, which passes things through ReactDom.deferredUpdates before setting component state

#### Props

N/A

#### Usage Example

```js
import { future: { Component } } from 'async-react-future';

class App extends Component {
  state = { showDetail: false };
  handleClick = id => {
    this.deferSetState({ showDetail: true });
  };
  render() {
    // use this.handleClick somewhere
  }
}
```

</details>

<details>

<summary>Img</summary>

> Img component from Dan's demo

Suspends image fetching. pretty much.

#### Props

```js
const {
  src, // required
  alt = '', // probably required
  ...rest
} = props;
```

#### Usage Example

```js
import { future: { Img } } from 'async-react-future';

// later
<Img src={src} alt="poster" />
```

</details>

Misc components

<details>

<summary>Never</summary>

> Never component from Suspense test

Throws a promise that resolves after some arbitrarily large number of seconds. The idea is that this component will never resolve. It's always wrapped by a Timeout.

Source: https://github.com/acdlite/react/blob/7166ce6d9b7973ddd5e06be9effdfaaeeff57ed6/packages/react-reconciler/src/__tests__/ReactSuspense-test.js#L558

#### Props

N/A

#### Usage Example

```js
import { future: { Never } } from 'async-react-future';

function Delay({ms}) {
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
```

</details>

<details>
<summary>Delay</summary>

> Delay component from Suspense test

Delay a render of peer components by `ms` milliseconds. Can be used to debounce, for example. Once ms has elapsed, render null. This allows the rest of the tree to resume rendering.

Source: https://github.com/acdlite/react/blob/7166ce6d9b7973ddd5e06be9effdfaaeeff57ed6/packages/react-reconciler/src/__tests__/ReactSuspense-test.js#L558

#### Props

N/A

#### Usage Example

```js
import React, {Fragment} from 'react';
import { future: { Delay } } from 'async-react-future';

function DebouncedText({text, ms}) {
  return (
    <Fragment>
      <Delay ms={ms} />
      <Text text={text} />  {/* defined elsewhere */}
    </Fragment>
  );
}
```

</details>

<details>

<summary>LowPriority</summary>

> LowPriority component from Peggy's ReactEurope demo

Defers (makes low priority) prop changes to its children through manipulating a `value` prop on a `stateKey`.
from https://github.com/peggyrayzis/react-europe-apollo

#### Props

```js
const {
  stateKey, // required, string
  value, // required, any
  children // function as a child, gets the deferred props passed to LowPriority
} = this.props;
```

#### Usage Example

```js
import { future: { LowPriority } } from 'async-react-future';
import React, {Timeout} from 'react'

// later
<LowPriority
  stateKey="selectedDog"
  value={this.state.selectedDog}> {/* not deferred */}
  {selectedDog => ( // deferred
    <Timeout ms={2000}>
      {expired =>
        expired && selectedDog ? (
          <Loading /> {/* defined elsewhere */}
        ) : (
          <Photo breed={selectedDog} /> {/* defined elsewhere */}
        )
      }
    </Timeout>
  )}
</LowPriority>
```

</details>

### `./mockapi`

<details>

<summary>Raw Data</summary>

> Raw movie data to make demo clones

* moviesOverview (array of movie objects)
* movieDetailsJSON (an object map of movie id: movie detail object)
* movieReviewsJSON (an object map of movie id: movie review object)

#### Usage Example

```js
import {
  mockapi: { moviesOverview },
  movieDemo: { MovieListPage}
  } from 'async-react-future';

// later
<MovieListPage
  onMovieClick={handleMovieClick}  {/* defined elsewhere */}
  loadingId={currentId}  {/* defined elsewhere */}
  moviesOverview={moviesOverview}
/>
```

</details>

<details>

<summary>Fetch Data</summary>

> Async wrappers with delays for the raw data

* fetchMovieList
* fetchMovieDetails
* fetchMovieReviews

#### Usage Example

```js
import {
  future: { createFetcher },
  mockapi: { fetchMofetchMovieReviewsvieList },
  movieDemo: { MovieListPage}
  } from 'async-react-future';

const movieReviewsFetcher = createFetcher(fetchMovieReviews);

function MovieReviews({ movieId }) {
  const reviews = movieReviewsFetcher.read(movieId);
  return <div className="MovieReviews">{reviews.map(review => <div key={review}>{review}</div>)}</div>;
}
```

</details>

<details>

<summary>Utilities</summary>

Just a `delay` function for now

#### Usage Example

```js
export const fetchMovieDetails = async (id, delayMS = 100) => {
  await delay(delayMS);
  return movieDetailsJSON[id];
};
```

</details>

### `./movieDemo`

Styled components that help to rapidly recreate demo clones and minimize code people have to dig through.

#### Pages

<details>

<summary>MovieListPage</summary>

> A MovieListPage

A MovieListPage

#### Usage Example

```js
import {
  mockapi: { moviesOverview },
  movieDemo: { MovieListPage}
  } from 'async-react-future';

// later
<MovieListPage
  onMovieClick={handleMovieClick}  {/* defined elsewhere */}
  loadingId={currentId}  {/* defined elsewhere */}
  moviesOverview={moviesOverview}
/>
```

</details>

The rest of this documentation is yet to be completed.

#### Utilities

<details>

<summary>Spinner</summary>

> A simple Spinner

A simple css spinner that always spins, pass `size={'large'}` for 2x size

#### Usage Example

```js
import {
  future: { Placeholder }
  movieDemo: { Spinner }
  } from 'async-react-future';

// later...
 <Placeholder delayMs={1000} fallback={<Spinner />}>
   {/* stuff with suspenders in here */}
 </Placeholder>
```

</details>

---

## Attribution

I have studied a lot of people's code and you are likely to see shades of your code pop up here and there. I don't claim any rights at all to any of this. I'll try to attribute as many people as possible but apologies in advance if I forgot to include you.

* https://github.com/BenoitZugmeyer/react-suspense-demo for much of the `./future` API
* https://medium.com/@pete_gleeson/creating-suspense-in-react-16-2-dcf4cb1a683f for `Loading`
* https://github.com/pomber/hitchcock/blob/master/src/cache.js for cache

Library was bootstrapped with: https://github.com/transitive-bullshit/create-react-library

## License

MIT © [sw-yx](https://github.com/sw-yx)
