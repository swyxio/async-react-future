export const fetchMovieReviews = delay =>
  new Promise((res, rej) => {
    setTimeout(() => res([1, 2, 3]), delay);
  });
