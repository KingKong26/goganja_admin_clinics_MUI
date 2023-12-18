import React from 'react';
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AddForm from './products/AddForm';
import Bookings from './pages/Bookings';


export default function App() {
  return (
   <>
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />}></Route>
        <Route path="/products" exact element={<Products />}></Route>
        <Route path="/analytics" exact element={<Analytics />}></Route>
        <Route path="/settings" exact element={<Settings />}></Route>
        <Route path="/add-clinic" exact element={<AddForm />}></Route>
        <Route path="/bookings" exact element={<Bookings />}></Route>

      </Routes>
    </BrowserRouter>
   </>
  )
}
