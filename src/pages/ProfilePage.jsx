import React, { useEffect, useState } from "react";
import { api } from "../api/API";
import authStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const logout = authStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get("/api/v1/auth/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.log("PROFILE ERROR:", err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!profile)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Profil</h1>

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
            {profile.user?.name?.[0]}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {profile.user?.name}
          </h2>
          <p className="text-gray-500">{profile.user?.email}</p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-[30px]">
            <span className="font-medium text-gray-700">Telefon:</span>
            <span className="text-gray-900">{profile.user?.phone}</span>
          </div>

          <div className="flex gap-[40px]">
            <span className="font-medium text-gray-700">Adres:</span>
            <span className="text-gray-900">{profile.address}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
