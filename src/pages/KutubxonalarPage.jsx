import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import { IconBooks } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const KutubxonalarPage = () => {
  const {
    libraries = [],
    loadLibraries,
    loadingLibraries,
    error,
  } = useAppStore();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!Array.isArray(libraries) || libraries.length === 0) {
      loadLibraries();
    }
  }, [loadLibraries, libraries]);

  const librariesList = Array.isArray(libraries) ? libraries : [];

  if (loadingLibraries) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-brown-700 border-t-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 text-xl">
        Xatolik yuz berdi!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <h1 className="text-3xl font-bold text-brown-800 text-center mb-12">
        {t("kutubxonalar.kutub")} ({librariesList.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {librariesList.map((lib) => (
          <Link
            key={lib.id}
            to={`/kutubxonalar/${lib.id}`}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
          >
            <div className="h-48 w-full overflow-hidden">
              <img
                src="https://ezma-client.vercel.app/assets/library-CY0z204p.webp"
                alt={lib.name || "Nomsiz kutubxona"}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-6 bg-[#4e342e] text-white">
              <h2 className="text-xl font-semibold mb-2">
                {lib.name || "Nomsiz kutubxona"}
              </h2>
              <p className="text-sm mb-3">
                {lib.address || "Manzil ko'rsatilmagan"}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <IconBooks size={20} />
                <span className="font-medium">
                  {lib.total_books || 0} ta kitob
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default KutubxonalarPage;
