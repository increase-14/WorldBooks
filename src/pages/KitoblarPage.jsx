import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import { useTranslation } from "react-i18next";
import { api } from "../store/useAppStore";

const BookCard = ({ book, onDelete, onRename }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(book.name);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!newName.trim() || newName === book.name) {
      setIsRenaming(false);
      return;
    }

    try {
      const payload = {
        name: newName.trim(),
        author: book.author || "",
        publisher: book.publisher || "",
        year: book.year || new Date().getFullYear(),
        quantity_in_library: book.quantity_in_library || 1,
        library: book.library || 1,
      };

      await api.put(`/api/v1/books/book/${book.id}/`, payload);
      onRename(book.id, newName.trim());
      setIsRenaming(false);
    } catch {
      alert("Nomni o'zgartirib bo'lmadi");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
      <div
        className="h-56 w-full overflow-hidden cursor-pointer"
        onClick={() => navigate(`/kitoblar/${book.id}`)}
      >
        <img
          src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          alt={book.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-5 bg-[#4e342e] text-white">
        {isRenaming ? (
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="flex-1 px-3 py-1 text-black rounded text-sm"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={handleSave} className="text-green-400 text-sm">
              Save
            </button>
            <button
              onClick={() => {
                setIsRenaming(false);
                setNewName(book.name);
              }}
              className="text-red-400 text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <h2 className="text-lg font-semibold mb-2 line-clamp-2">
            {book.name}
          </h2>
        )}

        {book.author && (
          <p className="text-sm mb-1 opacity-90">{book.author}</p>
        )}
        {book.publisher && (
          <p className="text-xs mb-1 opacity-80">{book.publisher}</p>
        )}
        {book.year && (
          <p className="text-xs mb-1 opacity-80">Yil: {book.year}</p>
        )}

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

        <div className="mt-4 flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRenaming(true);
            }}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
          >
            Rename
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book.id);
            }}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const KitoblarPage = () => {
  const { books, loadBooks, addBook, deleteBook } = useAppStore();
  const [localBooks, setLocalBooks] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showCrudMenu, setShowCrudMenu] = useState(false);
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showMultiModal, setShowMultiModal] = useState(false);

  const [singleBook, setSingleBook] = useState({
    name: "",
    author: "",
    publisher: "",
    year: "",
    quantity_in_library: "",
  });

  const [multiBooksList, setMultiBooksList] = useState([]);
  const [currentMultiBook, setCurrentMultiBook] = useState({
    name: "",
    author: "",
    publisher: "",
    year: "",
    quantity_in_library: "1",
  });

  useEffect(() => {
    if (books.length === 0) loadBooks();
    setLocalBooks(books);
  }, [books]);

  const handleSingleChange = (e) =>
    setSingleBook({ ...singleBook, [e.target.name]: e.target.value });

  const handleAddSingleBook = async () => {
    if (!singleBook.name.trim()) return alert("Kitob nomi kiritilishi kerak");
    try {
      await addBook({
        ...singleBook,
        year: Number(singleBook.year) || new Date().getFullYear(),
        quantity_in_library: Number(singleBook.quantity_in_library) || 1,
        library: 1,
      });
      setSingleBook({
        name: "",
        author: "",
        publisher: "",
        year: "",
        quantity_in_library: "",
      });
      setShowSingleModal(false);
      setShowCrudMenu(false);
    } catch {
      alert("Xatolik yuz berdi");
    }
  };

  const addToMultiList = () => {
    if (!currentMultiBook.name.trim())
      return alert("Kitob nomi kiritilishi kerak");
    setMultiBooksList([...multiBooksList, { ...currentMultiBook }]);
    setCurrentMultiBook({
      name: "",
      author: "",
      publisher: "",
      year: "",
      quantity_in_library: "1",
    });
  };

  const removeFromMultiList = (i) =>
    setMultiBooksList(multiBooksList.filter((_, idx) => idx !== i));

  const handleAddMultiBooks = async () => {
    if (multiBooksList.length === 0) return;
    let success = 0;
    for (const book of multiBooksList) {
      try {
        await addBook({
          ...book,
          year: Number(book.year) || new Date().getFullYear(),
          quantity_in_library: Number(book.quantity_in_library) || 1,
          library: 1,
        });
        success++;
      } catch {
        console.error("Multi add error");
      }
    }
    alert(`${success} ta kitob qo'shildi`);
    setShowMultiModal(false);
    setShowCrudMenu(false);
    setMultiBooksList([]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.toLowerCase().endsWith(".csv"))
      return alert("Faqat .csv fayl!");

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const lines = evt.target.result
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l);
        if (lines.length === 0) return alert("Fayl bo'sh!");

        let success = 0;
        const start = lines[0].toLowerCase().includes("name") ? 1 : 0;

        for (let i = start; i < lines.length; i++) {
          const cols = lines[i]
            .split(",")
            .map((s) => s.trim().replace(/^"|"$/g, ""));
          if (!cols[0]) continue;

          const [
            name,
            author = "Noma'lum",
            publisher = "",
            year = "",
            qty = "1",
          ] = cols;

          try {
            await addBook({
              name: name.trim(),
              author: author.trim(),
              publisher: publisher.trim() || "Noma'lum",
              year: Number(year) || new Date().getFullYear(),
              quantity_in_library: Number(qty) || 1,
              library: 1,
            });
            success++;
          } catch {
            console.error("CSV qatori xato:", lines[i]);
          }
        }
        alert(`Muvaffaqiyatli: ${success} ta kitob qo'shildi!`);
        setShowCrudMenu(false);
        e.target.value = null;
      } catch {
        alert("Fayl o'qilmadi");
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleDelete = async (id) => {
    if (!window) return;
    try {
      await deleteBook(id);
    } catch {
      alert("O'chirishda xatolik");
    }
  };

  const handleRename = (id, newName) => {
    setLocalBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, name: newName } : b))
    );
  };

  const ModalWrapper = ({ children, title, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">
          {title}
        </h2>
        {children}
        {onClose && (
          <button
            onClick={onClose}
            className="mt-5 w-full px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Bekor qilish
          </button>
        )}
      </div>
    </div>
  );

  const Input = ({ name, value, onChange, placeholder, type = "text" }) => (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || name}
      type={type}
      className="w-full border border-gray-300 rounded px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      <h1 className="text-3xl font-bold text-brown-800 text-center mb-6">
        {t("kitoblar.book")} ({localBooks.length})
      </h1>

      <button
        onClick={() => setShowCrudMenu(true)}
        className="fixed bottom-10 right-10 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition z-10"
      >
        Kitob qo'shish
      </button>

      {showCrudMenu && (
        <ModalWrapper title="Tanlang" onClose={() => setShowCrudMenu(false)}>
          <div className="space-y-3">
            <button
              onClick={() => {
                setShowSingleModal(true);
                setShowCrudMenu(false);
              }}
              className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium"
            >
              1 ta kitob
            </button>
            <button
              onClick={() => {
                setShowMultiModal(true);
                setShowCrudMenu(false);
              }}
              className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
            >
              Bir nechta kitob
            </button>
            <label className="block w-full py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-center cursor-pointer font-medium text-lg">
              CSV fayldan yuklash
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </ModalWrapper>
      )}

      {showSingleModal && (
        <ModalWrapper
          title="Yangi kitob qo'shish"
          onClose={() => setShowSingleModal(false)}
        >
          {["name", "author", "publisher", "year", "quantity_in_library"].map(
            (f) => (
              <Input
                key={f}
                name={f}
                value={singleBook[f]}
                onChange={handleSingleChange}
                placeholder={f === "name" ? "Kitob nomi *" : f}
                type={
                  f.includes("year") || f.includes("quantity")
                    ? "number"
                    : "text"
                }
              />
            )
          )}
          <button
            onClick={handleAddSingleBook}
            className="mt-4 w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium"
          >
            Saqlash
          </button>
        </ModalWrapper>
      )}

      {showMultiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">
              Bir nechta kitob qo'shish ({multiBooksList.length} ta)
            </h2>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50 mb-4">
              {[
                "name",
                "author",
                "publisher",
                "year",
                "quantity_in_library",
              ].map((f) => (
                <Input
                  key={f}
                  name={f}
                  value={currentMultiBook[f]}
                  onChange={(e) =>
                    setCurrentMultiBook({
                      ...currentMultiBook,
                      [e.target.name]: e.target.value,
                    })
                  }
                  placeholder={f === "name" ? "Kitob nomi *" : f}
                  type={
                    f.includes("year") || f.includes("quantity")
                      ? "number"
                      : "text"
                  }
                />
              ))}
              <button
                onClick={addToMultiList}
                className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
              >
                Ushbu kitobni qo'shish
              </button>
            </div>
            {multiBooksList.length > 0 && (
              <div className="mb-4 max-h-64 overflow-y-auto">
                {multiBooksList.map((b, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded mb-2"
                  >
                    <span className="text-sm">
                      <strong>{b.name}</strong> — {b.author || "muallif yo'q"}
                    </span>
                    <button
                      onClick={() => removeFromMultiList(i)}
                      className="text-red-600 text-sm"
                    >
                      o'chirish
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowMultiModal(false);
                  setMultiBooksList([]);
                }}
                className="flex-1 py-3 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleAddMultiBooks}
                disabled={multiBooksList.length === 0}
                className="flex-1 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition font-medium"
              >
                Hammasini saqlash ({multiBooksList.length})
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mt-6">
        {localBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        ))}
      </div>
    </div>
  );
};

export default KitoblarPage;
