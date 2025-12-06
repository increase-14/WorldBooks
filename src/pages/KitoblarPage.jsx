import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../store/useAppStore";

const KitoblarPage = () => {
  const { books, loadBooks, loadingBooks, addBook, deleteBook } = useAppStore();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [newBook, setNewBook] = useState({
    name: "",
    author: "",
    publisher: "",
    year: "",
    quantity_in_library: "",
  });

  useEffect(() => {
    if (books.length === 0) loadBooks();
  }, []);

  const handleChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleAddBook = async () => {
    if (!newBook.name) return alert("Kitob nomi kiritilishi kerak");
    try {
      await addBook({
        ...newBook,
        year: Number(newBook.year),
        quantity_in_library: Number(newBook.quantity_in_library),
        library: 1,
      });
      setNewBook({
        name: "",
        author: "",
        publisher: "",
        year: "",
        quantity_in_library: "",
      });
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      alert("Kitob qo'shishda xatolik");
    }
  };

  const handleDeleteBook = async (id) => {
    if (window) {
      try {
        await deleteBook(id);
      } catch {
        console.log("Kitobni o'chirishda xatolik");
      }
    }
  };

  if (loadingBooks) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-brown-700 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      <h1 className="text-3xl font-bold text-brown-800 text-center mb-6">
        Kitoblar ({books.length})
      </h1>

      <button
        onClick={() => setOpenModal(true)}
        className="fixed bottom-10 right-10 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300"
      >
        Kitob qo‘shish
      </button>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Yangi kitob qo‘shish
            </h2>

            <div className="flex flex-col gap-3">
              <input
                name="name"
                value={newBook.name}
                onChange={handleChange}
                placeholder="Kitob nomi"
                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <input
                name="author"
                value={newBook.author}
                onChange={handleChange}
                placeholder="Muallif"
                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <input
                name="publisher"
                value={newBook.publisher}
                onChange={handleChange}
                placeholder="Nashriyot"
                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <input
                name="year"
                type="number"
                value={newBook.year}
                onChange={handleChange}
                placeholder="Yil"
                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <input
                name="quantity_in_library"
                type="number"
                value={newBook.quantity_in_library}
                onChange={handleChange}
                placeholder="Soni"
                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleAddBook}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Qo‘shish
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mt-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
          >
            <div
              className="h-56 w-full overflow-hidden"
              onClick={() => navigate(`/kitoblar/${book.id}`)}
            >
              <img
                src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                alt={book.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-5 bg-[#4e342e] text-white">
              <h2 className="text-lg font-semibold mb-2">{book.name}</h2>
              {book.author && <p className="text-sm mb-1">{book.author}</p>}
              {book.publisher && (
                <p className="text-xs mb-1">{book.publisher}</p>
              )}
              {book.year && <p className="text-xs mb-1">Yil: {book.year}</p>}
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  book.quantity_in_library > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-500 text-white"
                }`}
              >
                {book.quantity_in_library > 0
                  ? `${book.quantity_in_library} ta`
                  : "Mavjud emas"}
              </span>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleDeleteBook(book.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitoblarPage;
