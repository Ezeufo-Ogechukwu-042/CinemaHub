import { supabase } from "../supabase/client";

export const adminService = {

  // ==========================
  // DASHBOARD
  // ==========================

  async getDashboard() {

 
    const [
      moviesResult,
      ordersResult,
      profilesResult
    ] = await Promise.all([

      supabase
        .from("movies")
        .select("*"),

      supabase
        .from("orders")
        .select("*"),

      supabase
        .from("profiles")
        .select("*")

    ]);

    const movies = moviesResult.data || [];
    const users = profilesResult.data || [];
    const orders = ordersResult.data || [];

    const revenue = orders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    return {

      movies,
      users,
      orders,

      totalMovies: movies.length,
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue: revenue,

    };

  },

  // ==========================
  // MOVIES
  // ==========================

  async getMovies() {

    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return data;

  },

  async getMovie(id) {

    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;

  },

  async addMovie(movie) {

    const { data, error } = await supabase
      .from("movies")
      .insert(movie)
      .select()
      .single();

    if (error) throw error;

    return data;

  },

  async updateMovie(id, updates) {

    const { data, error } = await supabase
      .from("movies")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;

  },

  async deleteMovie(id) {

    const { error } = await supabase
      .from("movies")
      .delete()
      .eq("id", id);

    if (error) throw error;

  },

   async importMovie(movie) {

  // Check if the movie already exists
  const { data: existing } = await supabase
    .from("movies")
    .select("id")
    .eq("tmdb_id", movie.id)
    .maybeSingle();

  if (existing) {
    throw new Error("Movie already exists.");
  }

  const { data, error } = await supabase
    .from("movies")
    .insert([
      {
        tmdb_id: movie.id,

        price: Math.floor(movie.vote_average * 1200) + 2500,

        original_price: Math.floor(movie.vote_average * 1200) + 4000,

        stock: 100,

        featured: false,

        bestseller: movie.vote_count > 3000,

        new_release: movie.release_date
          ? Number(movie.release_date.slice(0, 4)) >= new Date().getFullYear()
          : false,

        active: true,

        currency: "NGN",

        trailer_url: "",

        featured_order: 0,
      },
    ])
    .select();

  if (error) throw error;

  return data;
 },


};