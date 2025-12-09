import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import axios from "axios";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { books, loadBooks, loadingBooks } = useAppStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    loadBooks();
  }, []);

  const searchBooks = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/search/book/`,
        {
          params: { q: query },
        }
      );

      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }
  };

  const list = results.length > 0 ? results : books.slice(0, 5);

  const handleKeyPress = (e) => {
    if (e.key) searchBooks();
  };

  return (
    <div className="min-h-screen bg-[#f4efe9] py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl text-center font-extrabold text-[#6b5238] mb-10">
          {t("home.book")}
        </h1>

        <div className="bg-white shadow rounded-xl p-5 mb-10 border border-[#d2b9a0]">
          <div className="flex gap-3">
            <input
              className="flex-1 px-4 py-3 border outline-0 border-[#c3a280] rounded-xl"
              placeholder="Kitob..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>

        {loadingBooks && (
          <div className="text-center py-10">
            <div className="animate-spin w-10 h-10 border-4 border-[#6b5238] border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}

        {!loadingBooks && list.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {list.map((book) => (
              <Link
                to={`/kitoblar/${book.id}`}
                key={book.id}
                className="bg-white border border-[#d2b9a0] rounded-xl shadow hover:-translate-y-2 hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                  className="h-56 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="font-semibold text-lg text-[#473624] line-clamp-2">
                    {book.name}
                  </h3>

                  {book.author && (
                    <p className="text-sm text-[#8e6f4d] mt-1 line-clamp-1">
                      {book.author}
                    </p>
                  )}

                  <div className="flex justify-between mt-4">
                    {book.year && (
                      <span className="text-xs px-2 py-1 bg-[#f0e8df] text-[#6b5238] rounded">
                        {book.year}
                      </span>
                    )}

                    <span
                      className={`text-xs px-2 py-1 rounded text-white ${
                        book.quantity_in_library > 0
                          ? "bg-green-600"
                          : "bg-red-500"
                      }`}
                    >
                      {book.quantity_in_library || 0} ta
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loadingBooks && list.length === 0 && (
          <p className="text-center text-[#6b5238] text-lg py-10">
            Natija topilmadi
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
