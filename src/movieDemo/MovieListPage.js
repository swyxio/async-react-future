// credit: https://codesandbox.io/s/kk2v1op3m5

import React from 'react';
import { Spinner } from './Spinner';
import styled from 'styled-components';

const MLPDiv = styled.div`
  .movie {
    background-color: #282828;
    border: 1px solid #444;
    border-radius: 5px;
    padding: 0.2rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    display: flex;
  }

  .movie .rating {
    padding: 0.5rem;
    font-size: 1.2rem;
  }

  .movie .main {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .movie .title {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .movie .info {
    font-size: 0.8rem;
    color: #888;
  }

  .movie .hover {
    display: none;
    padding: 0.5rem;
    align-self: center;
  }

  .movie:hover .hover {
    display: block;
  }

  .movie .loading {
    padding: 0.5rem;
    align-self: center;
  }
`;

export const MovieListPage = ({ loadingId, onMovieClick, moviesOverview }) => {
  return (
    <MLPDiv>
      <h1>Top Box Office {'🍿'}</h1>
      <div>
        {moviesOverview.map(movie => (
          <div className="movie" key={movie.id} onClick={() => onMovieClick(movie.id)}>
            <div className="rating">{movie.rating > 70 ? '🍅' : '🤢'}</div>
            <div className="main">
              <div className="title">{movie.title}</div>
              <div className="info">
                {movie.rating}% · {movie.gross}
              </div>
            </div>
            {loadingId !== movie.id && <div className="hover">{'👉'}</div>}
            {loadingId === movie.id && (
              <div className="loading">
                <Spinner size="small" />
              </div>
            )}
          </div>
        ))}
      </div>
    </MLPDiv>
  );
};
