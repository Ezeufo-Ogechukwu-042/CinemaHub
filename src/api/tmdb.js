const BASE_URL = "https://api.themoviedb.org/3";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const options = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    accept: "application/json",
  },
};

async function request(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`TMDB Error: ${response.status}`);
  }

  return response.json();
}

export async function searchMovies(query) {
  const response = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search movies");
  }

  const data = await response.json();

  return data.results;
}

export const tmdb = {
  getTrendingMovies: () => request("/trending/movie/week"),

  getPopularMovies: () => request("/movie/popular"),

  getTopRatedMovies: () => request("/movie/top_rated"),

  getUpcomingMovies: () => request("/movie/upcoming"),

  getMovieDetails: (id) => request(`/movie/${id}`),

  getMovieCredits: (id) => request(`/movie/${id}/credits`),

  getMovieVideos: (id) => request(`/movie/${id}/videos`),

  getSimilarMovies: (id) => request(`/movie/${id}/similar`),

  getConfiguration: () => request("/configuration"),

  searchMovies: (query) =>
    request(`/search/movie?query=${encodeURIComponent(query)}`),

  getGenres: () => request("/genre/movie/list"),
};