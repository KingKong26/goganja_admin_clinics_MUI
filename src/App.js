import React from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AddForm from "./products/AddForm";
import Bookings from "./pages/Bookings";
import { ThemeProvider, createTheme } from "@mui/material";
import Registration from "./pages/Register";
import Login from "./pages/Login";
// import { useAuth } from "./context/UserContext";
// import { auth, db } from "./firebase-config";
// import { doc, getDoc } from "firebase/firestore/lite";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

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
  // const { setUserData } = useAuth();

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route
              path="/registration"
              element={
                <PublicRoute>
                  <Registration />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="/products" exact element={<Products />} />
              <Route path="/analytics" exact element={<Analytics />} />
              <Route path="/settings" exact element={<Settings />} />
              <Route path="/add-clinic" exact element={<AddForm />} />
              <Route path="/bookings" exact element={<Bookings />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}
