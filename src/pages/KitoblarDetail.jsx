import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const KitoblarDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/book/${id}/`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        setBook(res.data);
      } catch (err) {
        console.error(err);
        setError("Kitob topilmadi");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-10 text-[#4e342e] text-xl animate-fade">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-600 animate-fade">{error}</div>
    );

  return (
    <div className="min-h-screen bg-white p-6 flex justify-center">
      <div className="bg-white border border-[#4e342e]/20 rounded-2xl shadow-xl w-full max-w-3xl p-6 animate-fade">
        <div className="w-full h-72 overflow-hidden rounded-xl shadow-md mb-6 animate-fadezoom">
          <img
            src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            alt={book.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-4xl font-extrabold text-[#4e342e] mb-4 animate-fade">
          {book.name}
        </h1>

        <div className="space-y-2 text-[#6d4c41] text-lg animate-fade">
          <p>
            <span className="font-semibold text-[#4e342e]">Muallif:</span>{" "}
            {book.author || "Noma'lum"}
          </p>

          <p>
            <span className="font-semibold text-[#4e342e]">Nashriyot:</span>{" "}
            {book.publisher || "Noma'lum"}
          </p>
        </div>

        <div className="mt-4 animate-fade">
          <Link
            to="/kitoblar"
            className="inline-block bg-[#4e342e] text-white px-6 py-3 rounded-lg hover:bg-[#3e2723] shadow transition duration-300"
          >
            Ortga
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KitoblarDetail;
