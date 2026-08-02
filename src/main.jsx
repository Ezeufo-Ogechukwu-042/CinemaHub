import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./Styles/responsive.css";
import "./Styles/globals.css";
import { UserProvider } from "./Context/UserContext";
import { MovieProvider } from "./Context/MovieContext";
import { CartProvider } from "./Context/CartContext";
import { WishlistProvider } from "./Context/WishlistContext";
import { SearchProvider } from "./Context/SearchContext";
import { ThemeProvider } from "./Context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
    <MovieProvider>
      <BrowserRouter>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </BrowserRouter>
    </MovieProvider>
  </UserProvider>
);