function getNewRatingMovies(arr, newMovie) {
  const newMovieIndex =
    newMovie.rating > arr[0].rating
      ? 1
      : newMovie.rating < arr[arr.length - 1].rating
      ? arr[arr.length - 1].rating + 1
      : arr.reduce((acc, movie, i) => {
          if (movie.rating <= newMovie && newMovie <= arr[i + 1].rating) {
          }
        }, 0);
}
