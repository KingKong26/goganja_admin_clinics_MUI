import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AddForm from "./products/AddForm";
import Bookings from "./pages/Bookings";
import { ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["montserrat"].join(","),
  },
  palette: {
    primary: {
      main: "#314435",
    },
    secondary: {
      main: "#D7A90E",
    },
    background: {
      main: "#FFFFFF",
    },
  },
});
export default function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" exact element={<Home />}></Route>
            <Route path="/products" exact element={<Products />}></Route>
            <Route path="/analytics" exact element={<Analytics />}></Route>
            <Route path="/settings" exact element={<Settings />}></Route>
            <Route path="/add-clinic" exact element={<AddForm />}></Route>
            <Route path="/bookings" exact element={<Bookings />}></Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}
