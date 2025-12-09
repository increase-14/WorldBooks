import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authStore from "../store/authStore";
import { api } from "../store/useAppStore";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const logout = authStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndBooks = async () => {
      try {
        const profileRes = await api.get("/api/v1/auth/profile/");
        const userProfile = profileRes.data;
        setProfile(userProfile);

        if (userProfile.library?.id) {
          const libraryRes = await api.get(
            `/api/v1/libraries/library/${userProfile.library.id}/`
          );
          const libraryData = libraryRes.data;

          const books = libraryData.results?.books || libraryData.books || [];
          setMyBooks(books);
        }
      } catch (err) {
        console.error("Xato:", err);
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndBooks();
  }, [logout, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Mening profilim
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 text-center">
          <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-5xl font-bold text-white shadow-2xl">
            {profile?.user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-800">
            {profile?.user?.name || "Azizbek"}
          </h2>
          <p className="text-lg text-gray-600">
            {profile?.user?.phone || "+99890127331"}
          </p>

          {profile?.library ? (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
              <p className="text-2xl font-bold text-blue-800">
                {profile.library.name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {profile.library.address || "Chilonzor, Toshkent"}
              </p>
            </div>
          ) : (
            <p className="mt-8 text-red-600 font-semibold">
              Kutubxona ulanmagan
            </p>
          )}

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="mt-10 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition shadow-lg"
          >
            Chiqish
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center justify-between">
            <span>Kitoblarim</span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-bold">
              {myBooks.length} ta
            </span>
          </h3>

          {myBooks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 mb-6">
                Hozircha kitob qo'shilmagan
              </p>
              <button
                onClick={() => navigate("/kitoblar")}
                className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-lg font-medium"
              >
                Kitob qo'shish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {myBooks.map((book, index) => (
                <div
                  key={book.id || index}
                  onClick={() => navigate(`/kitoblar/${book.id}`)}
                  className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-amber-400 transition-all">
                    <div className="w-full h-48 mb-4 bg-white rounded-xl shadow-inner flex items-center justify-center overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e"
                        alt={book.name}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition"
                      />
                    </div>
                    <h4 className="font-bold text-gray-800 text-center line-clamp-2">
                      {book.name || `Kitob ${index + 1}`}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
