// i understand this file may be a bit confusing
//
// we want to export just some components that go with the css
// aim is to be agnostic of loader
// so we export the stuff that is agnostic of loader
// but leave in some details of how things work with loader if you just want to build an example off of it
// credit: https://codesandbox.io/s/kk2v1op3m5

import React from 'react';
import { Spinner } from './Spinner';
import styled from 'styled-components';

// async agnostic
export const MoviePageComponent = ({ id, MovieDetails, MovieReviews }) => (
  <div>
    <MovieDetails id={id} />
    <MovieReviews id={id} />
  </div>
);

export const MovieDetailsComponent = ({ movie, MoviePoster }) => (
  <div className="MovieDetails">
    <MoviePoster src={movie.poster} />
    <h1>{movie.title}</h1>
    <MovieMetrics {...movie} />
  </div>
);

const StyledMoviePoster = styled.div`
  float: left;
  margin-right: 1rem;
  margin-bottom: 1rem;
`;
// show me how to display images, can just give me an <img> if dont want async
export const MoviePosterComponent = ({ src, Img }) => (
  <StyledMoviePoster>
    <Img src={src} alt="poster" />
  </StyledMoviePoster>
);

// pure functional!
export const MovieMetrics = movie => (
  <div>
    <div>
      <h3>Tomatometer</h3>
      {movie.rating > 70 ? '🍅' : '🤢'}
      {movie.rating}%
    </div>
    <div>
      <h3>Critics Consensus</h3>
      {movie.consensus}
    </div>
  </div>
);
export const MovieMetricsComponent = MovieMetrics; // just an alias

const StyledMovieReviews = styled.div`
  clear: left;
  display: flex;
  justify-content: center;
  .review {
    background-color: #282828;
    border: 1px solid #444;
    border-radius: 5px;
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    margin-bottom: 1rem;
  }

  .review .author {
    margin-top: 1rem;
    color: #888;
  }
`;
export const MovieReviewsComponent = ({ reviews }) => (
  <StyledMovieReviews>
    {reviews &&
      reviews.map((review, index) => (
        <div className="review" key={index}>
          <div className="summary">{review.summary}</div>
          <div className="author">{review.author}</div>
        </div>
      ))}
  </StyledMovieReviews>
);

/// the stuff that isnt meant to be exported

// probably not helpful since the components probably need to be async
const MoviePage = ({ id }) => <MoviePageComponent id={id} MovieDetails={MovieDetails} MovieReviews={MovieReviews} />;
// basically kinda shows how to wrap in a hitchcock Loader; not meant for use
const MovieDetails = ({ id, detailsSource, Loader }) => (
  <Loader source={detailsSource} params={id}>
    {movie => (
      <MovieDetailsComponent
        movie={movie}
        MoviePoster={MoviePoster} // from scope
        MovieMetrics={MovieMetrics} // from scope
      />
    )}
  </Loader>
);
const Img = props => {
  const { Loader, ...rest } = props;
  return (
    <Loader source={imageSource} params={props.src}>
      {src => <img {...rest} src={src} />}
    </Loader>
  );
};

const MoviePoster = ({ src }) => (
  <div className="MoviePoster">
    <Img src={src} alt="poster" />
  </div>
);
const MovieReviews = ({ id, reviewsSource, Loader }) => (
  <Loader source={reviewsSource} params={id} wait={100} fallback={<Spinner size="medium" />}>
    {reviews => <MovieReviewsComponent reviews={reviews} />}
  </Loader>
);
