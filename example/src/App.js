import React, { Component, unstable_AsyncMode as AsyncMode } from "react";

import { createFetcher, Placeholder } from "async-react-future";
import { fetchMovieReviews } from "./api";
import "./Spinner.css";
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
