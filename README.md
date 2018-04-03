# async-react-future

> THIS IS A HIGHLY UNSTABLE AND UNRELIABLE LIBRARY, DO NOT USE IF YOU DON'T KNOW WHAT YOU ARE DOING

This library helps experimentation as explored in talks by @swyx:

* https://slides.com/swyx/react-suspense
* https://slides.com/swyx/background-thread

If you want further hints on how to use this library, check these articles:

* https://dev.to/swyx/how-to-try-react-suspense-in-5-minutes-474c

and watch this repo: https://github.com/sw-yx/fresh-async-react

[![NPM](https://img.shields.io/npm/v/async-react-future.svg)](https://www.npmjs.com/package/async-react-future) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save async-react-future
```

## Usage

```jsx
import React, { Component } from "react";

import { createFetcher, Placeholder } from "async-react-future";

import { fetchMovieReviews } from "./api";
const movieReviewsFetcher = createFetcher(fetchMovieReviews);

function MovieReviews({ movieId }) {
  const reviews = movieReviewsFetcher.read(movieId);
  return <div className="MovieReviews">{reviews.map(review => <div key={review}>{review}</div>)}</div>;
}
export default class App extends Component {
  render() {
    return (
      <AsyncMode>
        <Placeholder delayMs={1000} fallback={<div className="Spinner" />}>
          <div>
            <h1>welcome to the async react future </h1>
            <MovieReviews movieId={2000} />
          </div>
        </Placeholder>
      </AsyncMode>
    );
  }
}
```

## License

MIT © [sw-yx](https://github.com/sw-yx)
