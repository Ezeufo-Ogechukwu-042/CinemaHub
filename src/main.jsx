import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./Styles/responsive.css";
import "./Styles/globals.css";
import { UserProvider } from "./context/UserContext";
import { MovieProvider } from "./context/MovieContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";

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