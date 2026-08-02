import { tmdb } from "../api/tmdb";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

let cachedGenres = [];

async function loadGenres() {
  if (cachedGenres.length > 0) {
    return cachedGenres;
  }

  const data = await tmdb.getGenres();

  cachedGenres = data.genres;

  return cachedGenres;
}

function mapMovie(movie, genres = []) {
  return {
    id: movie.id,

    title: movie.title,

    poster: movie.poster_path
      ? `${IMAGE_BASE}${movie.poster_path}`
      : "/placeholder-poster.png",

    backdrop: movie.backdrop_path
      ? `${IMAGE_BASE}${movie.backdrop_path}`
      : "/placeholder-backdrop.jpg",

    rating: Number(movie.vote_average.toFixed(1)),

    year: movie.release_date
      ? movie.release_date.slice(0, 4)
      : "N/A",

    description: movie.overview,

    genreIds: movie.genre_ids || [],

    // genre:
    //   movie.genre_ids?.map(id => {
    //     const found = genres.find(g => g.id === id);
    //     return found ? found.name : null;
    //   }).filter(Boolean) || [],

    genre:
  movie.genre_ids?.map((id) => {
    const found = (genres || []).find((g) => g.id === id);
    return found ? found.name : "Unknown";
  }) || [],

    popularity: movie.popularity,

    adult: movie.adult,

    releaseDate: movie.release_date,

    originalLanguage: movie.original_language,

    duration: "2h",

    price:
      Math.floor(movie.vote_average * 1200) + 2500,

    originalPrice:
      Math.floor(movie.vote_average * 1200) + 4000,

    discount: 20,

    trending: movie.popularity > 300,

    topRated: movie.vote_average >= 8,

    bestseller: movie.vote_count > 3000,

    newRelease:
      movie.release_date
        ? Number(movie.release_date.slice(0, 4)) >= 2025
        : false,
  };
}

export const movieService = {
  async getTrending() {
    const genres = await loadGenres();

    const data = await tmdb.getTrendingMovies();

    return data.results.map(movie => mapMovie(movie, genres));
  }, 

  async getPopular() {
    const genres = await loadGenres();

    const data = await tmdb.getPopularMovies();

    return data.results.map(movie => mapMovie(movie, genres));
  },

  async getTopRated() {
    const genres = await loadGenres();

    const data = await tmdb.getTopRatedMovies();

    return data.results.map(movie => mapMovie(movie, genres));
  },

  async getUpcoming() {
    const genres = await loadGenres();

    const data = await tmdb.getUpcomingMovies();

    return data.results.map(movie => mapMovie(movie, genres));
  },

  async getMovie(id) {
    return await tmdb.getMovieDetails(id);
  },

  async getCredits(id) {
    return await tmdb.getMovieCredits(id);
  },

  async getVideos(id) {
    return await tmdb.getMovieVideos(id);
  },

  async getSimilar(id) {
    const genres = await loadGenres();

    const data = await tmdb.getSimilarMovies(id);

    return data.results.map(movie => mapMovie(movie, genres));
  },

  async search(query) {
    const genres = await loadGenres();

    const data = await tmdb.searchMovies(query);

    return data.results.map(movie => mapMovie(movie, genres));
  },

  async getGenres() {
    const data = await tmdb.getGenres();
    return data.genres;
  }
};