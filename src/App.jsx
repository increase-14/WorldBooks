import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import KitoblarPage from "./pages/KitoblarPage";
import KutubxonalarPage from "./pages/KutubxonalarPage";
import KitoblarDetail from "./pages/KitoblarDetail";
import KutubxonalarDetail from "./pages/KutubxonalarDetail";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="kitoblar" element={<KitoblarPage />} />
        <Route path="kitoblar/:id" element={<KitoblarDetail />} />
        <Route path="kutubxonalar" element={<KutubxonalarPage />} />
        <Route path="kutubxonalar/:id" element={<KutubxonalarDetail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
