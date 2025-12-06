import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import KitoblarPage from "./pages/KitoblarPage";
import KutubxonalarPage from "./pages/KutubxonalarPage";
import KitoblarDetail from "./pages/KitoblarDetail";
import KutubxonalarDetail from "./pages/KutubxonalarDetail";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="kitoblar" element={<KitoblarPage />} />
        <Route path="kitoblar/:id" element={<KitoblarDetail />} />
        <Route path="kutubxonalar" element={<KutubxonalarPage />} />
        <Route path="kutubxonalar/:id" element={<KutubxonalarDetail />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="login" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
