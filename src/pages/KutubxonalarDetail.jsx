import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import { IconArrowLeft } from "@tabler/icons-react";

const KutubxonalarDetail = () => {
  const { id } = useParams();

  const currentLibrary = useAppStore((state) => state.currentLibrary);
  const loadingLibraryDetail = useAppStore(
    (state) => state.loadingLibraryDetail
  );
  const error = useAppStore((state) => state.error);
  const loadLibraryDetail = useAppStore((state) => state.loadLibraryDetail);

  useEffect(() => {
    if (id) loadLibraryDetail(id);
  }, [id, loadLibraryDetail]);

  if (loadingLibraryDetail) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !currentLibrary) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Kutubxona topilmadi
        </h1>
        <p className="text-gray-500 text-lg mb-8">ID: {id}</p>

        <Link
          to="/kutubxonalar"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <IconArrowLeft size={20} />
          Orqaga
        </Link>
      </div>
    );
  }

  const books = currentLibrary?.results?.books || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/kutubxonalar"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-10 text-lg font-medium transition"
        >
          <IconArrowLeft size={22} />
          Orqaga
        </Link>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Mavjud kitoblar
        </h2>

        {books.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <p className="text-xl text-gray-500">
              Bu kutubxonada kitoblar hali qo'shilmagan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {books.map((el, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="h-64 bg-gray-200 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e"
                    alt="book"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-semibold text-xl text-gray-900">
                    {el.name}
                  </h3>

                  <p className="text-gray-700">
                    <span className="font-medium">Muallif:</span>{" "}
                    {el.author || "Noma'lum"}
                  </p>

                  {el.publisher && (
                    <p className="text-gray-500 text-sm">
                      Nashriyot: {el.publisher}
                    </p>
                  )}

                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
                    Mavjud: {el.quantity_in_library} dona
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KutubxonalarDetail;
