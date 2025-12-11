import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAppStore, { api } from "../store/useAppStore";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconX,
  IconUpload,
  IconDownload,
  IconLoader2,
} from "@tabler/icons-react";

const BookCard = ({ book, onDelete, onRename }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(book.name);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!newName.trim() || newName === book.name) return setIsRenaming(false);
    try {
      await api.put(`/api/v1/books/book/${book.id}/`, { name: newName.trim() });
      onRename(book.id, newName.trim());
      notifications.show({
        title: "Muvaffaqiyatli",
        message: "Kitob nomi o'zgartirildi",
        color: "green",
        icon: <IconCheck />,
      });
      setIsRenaming(false);
    } catch {
      notifications.show({
        title: "Xatolik",
        message: "Nomni o'zgartirib bo'lmadi",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div
        className="h-56 cursor-pointer"
        onClick={() => navigate(`/kitoblar/${book.id}`)}
      >
        <img
          src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800"
          alt={book.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 bg-[#4e342e] text-white">
        {isRenaming ? (
          <div className="flex gap-2 mb-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="flex-1 px-3 py-1.5 text-black rounded text-sm"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="text-green-400 text-xs font-bold"
            >
              OK
            </button>
            <button
              onClick={() => {
                setIsRenaming(false);
                setNewName(book.name);
              }}
              className="text-red-400 text-xs font-bold"
            >
              X
            </button>
          </div>
        ) : (
          <h2 className="text-lg font-bold mb-2 line-clamp-2">{book.name}</h2>
        )}

        {book.author && <p className="text-sm opacity-90">{book.author}</p>}
        {book.publisher && (
          <p className="text-xs opacity-80">{book.publisher}</p>
        )}
        {book.year && <p className="text-xs opacity-80">Yil: {book.year}</p>}

        <span
          className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${
            book.quantity_in_library > 0
              ? "bg-green-100 text-green-800"
              : "bg-red-600 text-white"
          }`}
        >
          {book.quantity_in_library > 0
            ? `${book.quantity_in_library} ta`
            : "Yo'q"}
        </span>

        <div className="mt-4 flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRenaming(true);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition"
          >
            Rename
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("O'chirish?")) onDelete(book.id);
            }}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium transition"
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
  const gridRef = useRef(null);

  const [showSingle, setShowSingle] = useState(false);
  const [showTen, setShowTen] = useState(false);
  const [showExcel, setShowExcel] = useState(false);
  const [excelData, setExcelData] = useState([]);

  const [singleForm, setSingleForm] = useState({
    name: "",
    author: "",
    publisher: "",
    year: "",
    quantity_in_library: "1",
  });
  const [tenBooks, setTenBooks] = useState(
    Array(10)
      .fill(null)
      .map(() => ({
        name: "",
        author: "",
        publisher: "",
        year: "",
        quantity_in_library: "1",
      }))
  );

  const [tenLoading, setTenLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  useEffect(() => {
    if (books.length === 0) loadBooks();
    setLocalBooks(books);

    if (books.length > localBooks.length && gridRef.current) {
      setTimeout(() => {
        gridRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 300);
    }
  }, [books]);

  const handleRename = (id, newName) => {
    setLocalBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, name: newName } : b))
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Rostdan o'chirasizmi?")) return;
    try {
      await deleteBook(id);
      notifications.show({
        title: "Muvaffaqiyatli",
        message: "Kitob o'chirildi",
        color: "green",
        icon: <IconCheck />,
      });
    } catch {
      notifications.show({
        title: "Xatolik",
        message: "O'chirib bo'lmadi",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  const handleAddSingle = async () => {
    if (!singleForm.name.trim())
      return notifications.show({
        title: "Xatolik",
        message: "Kitob nomi bo'sh!",
        color: "red",
      });
    try {
      await addBook({
        ...singleForm,
        year: Number(singleForm.year) || 2024,
        quantity_in_library: Number(singleForm.quantity_in_library) || 1,
        library: 1,
      });
      notifications.show({
        title: "Muvaffaqiyatli",
        message: "Kitob qo'shildi!",
        color: "green",
        icon: <IconCheck />,
      });
      setShowSingle(false);
      setSingleForm({
        name: "",
        author: "",
        publisher: "",
        year: "",
        quantity_in_library: "1",
      });
    } catch {
      notifications.show({
        title: "Xatolik",
        message: "Kitob qo'shib bo'lmadi",
        color: "red",
      });
    }
  };

  const handleAddTenBooks = async () => {
    const valid = tenBooks.filter((b) => b.name.trim());
    if (valid.length === 0)
      return notifications.show({
        title: "Xatolik",
        message: "Hech bo'lmaganda 1 ta nom kiriting!",
        color: "red",
      });

    setTenLoading(true);
    let success = 0;
    for (const book of valid) {
      try {
        await addBook({
          name: book.name.trim(),
          author: book.author.trim() || "Noma'lum",
          publisher: book.publisher.trim() || "Noma'lum",
          year: Number(book.year) || 2024,
          quantity_in_library: Number(book.quantity_in_library) || 1,
          library: 1,
        });
        success++;
      } catch (err) {
        console.error(err);
      }
    }
    setTenLoading(false);
    notifications.show({
      title: "Muvaffaqiyatli!",
      message: `${success} ta kitob qo'shildi!`,
      color: "green",
      icon: <IconCheck />,
    });
    setShowTen(false);
    setTenBooks(
      Array(10)
        .fill(null)
        .map(() => ({
          name: "",
          author: "",
          publisher: "",
          year: "",
          quantity_in_library: "1",
        }))
    );
  };

  const updateTenBook = (i, field, value) => {
    setTenBooks((prev) =>
      prev.map((b, idx) => (idx === i ? { ...b, [field]: value } : b))
    );
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        const formatted = json
          .map((row) => ({
            name: String(row.name || row.Nom || row.kitob || "").trim(),
            author:
              String(row.author || row.Muallif || "").trim() || "Noma'lum",
            publisher:
              String(row.publisher || row.Nashriyot || "").trim() || "Noma'lum",
            year: Number(row.year || row.Yil) || 2024,
            quantity_in_library: Number(row.quantity || row.Soni || 1) || 1,
          }))
          .filter((b) => b.name);

        if (formatted.length === 0) {
          notifications.show({
            title: "Xatolik",
            message: "Excelda kitob topilmadi!",
            color: "red",
          });
          return;
        }

        setExcelData(formatted);
        setShowExcel(true);
      } catch {
        notifications.show({
          title: "Xatolik",
          message: "Excel faylini o'qib bo'lmadi",
          color: "red",
        });
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = null;
  };

  const confirmExcelImport = async () => {
    setExcelLoading(true);
    let success = 0;
    for (const book of excelData) {
      try {
        await addBook({ ...book, library: 1 });
        success++;
      } catch {}
    }
    setExcelLoading(false);
    notifications.show({
      title: "Muvaffaqiyatli!",
      message: `${success} ta kitob qo'shildi!`,
      color: "green",
      icon: <IconCheck />,
    });
    setShowExcel(false);
    setExcelData([]);
    loadBooks();
  };

  const exportExcel = () => {
    if (localBooks.length === 0)
      return notifications.show({
        title: "Xatolik",
        message: "Kitoblar yo'q!",
        color: "red",
      });
    const data = localBooks.map((b) => ({
      Nom: b.name,
      Muallif: b.author || "",
      Nashriyot: b.publisher || "",
      Yil: b.year || "",
      Soni: b.quantity_in_library || 0,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kitoblar");
    XLSX.writeFile(
      wb,
      `kitoblar_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
    notifications.show({
      title: "Muvaffaqiyatli",
      message: "Excel yuklandi!",
      color: "green",
      icon: <IconDownload />,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#4e342e]">
            {t("kitoblar.book")} ({localBooks.length})
          </h1>
          <div className="flex gap-4">
            <button
              onClick={exportExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
            >
              <IconDownload size={20} /> Excel yuklab olish
            </button>
            <label className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition flex items-center gap-2">
              <IconUpload size={20} /> Excel yuklash
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          onClick={() => setShowSingle(true)}
          className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white w-16 h-16 rounded-full shadow-2xl text-4xl z-50 transition transform hover:scale-110"
        >
          +
        </button>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
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

      {showSingle && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Yangi kitob qo'shish
            </h2>
            <input
              placeholder="Nomi *"
              value={singleForm.name}
              onChange={(e) =>
                setSingleForm({ ...singleForm, name: e.target.value })
              }
              className="w-full border p-3 rounded mb-3 focus:ring-2 focus:ring-green-500"
            />
            <input
              placeholder="Muallif"
              value={singleForm.author}
              onChange={(e) =>
                setSingleForm({ ...singleForm, author: e.target.value })
              }
              className="w-full border p-3 rounded mb-3"
            />
            <input
              placeholder="Nashriyot"
              value={singleForm.publisher}
              onChange={(e) =>
                setSingleForm({ ...singleForm, publisher: e.target.value })
              }
              className="w-full border p-3 rounded mb-3"
            />
            <input
              placeholder="Soni"
              value={singleForm.quantity_in_library}
              onChange={(e) =>
                setSingleForm({
                  ...singleForm,
                  quantity_in_library: e.target.value,
                })
              }
              className="w-full border p-3 rounded mb-6"
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowSingle(false)}
                className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Bekor
              </button>
              <button
                onClick={handleAddSingle}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Saqlash
              </button>
            </div>
            <button
              onClick={() => {
                setShowSingle(false);
                setShowTen(true);
              }}
              className="mt-4 w-full text-center text-blue-600 hover:underline"
            >
              10 ta kitob qo'shish
            </button>
          </div>
        </div>
      )}

      {showTen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-screen overflow-y-auto p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
              10 ta kitob qo'shish
            </h2>
            <div className="space-y-4">
              {tenBooks.map((book, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg border"
                >
                  <input
                    placeholder={`Nom ${i + 1} *`}
                    value={book.name}
                    onChange={(e) => updateTenBook(i, "name", e.target.value)}
                    className="border p-2 rounded"
                  />
                  <input
                    placeholder="Muallif"
                    value={book.author}
                    onChange={(e) => updateTenBook(i, "author", e.target.value)}
                    className="border p-2 rounded"
                  />
                  <input
                    placeholder="Nashriyot"
                    value={book.publisher}
                    onChange={(e) =>
                      updateTenBook(i, "publisher", e.target.value)
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    placeholder="Soni"
                    value={book.quantity_in_library}
                    onChange={(e) =>
                      updateTenBook(i, "quantity_in_library", e.target.value)
                    }
                    className="border p-2 rounded"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowTen(false)}
                disabled={tenLoading}
                className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded disabled:opacity-50"
              >
                Bekor
              </button>
              <button
                onClick={handleAddTenBooks}
                disabled={tenLoading}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {tenLoading ? (
                  <>
                    <IconLoader2 className="animate-spin" /> Qo'shilmoqda...
                  </>
                ) : (
                  "Hammasini qo'shish"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showExcel && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-screen overflow-y-auto p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Excel dan topildi: {excelData.length} ta kitob
            </h2>
            <div className="overflow-x-auto mb-6 border rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left border">Nom</th>
                    <th className="p-3 text-left border">Muallif</th>
                    <th className="p-3 text-left border">Nashriyot</th>
                    <th className="p-3 text-left border">Yil</th>
                    <th className="p-3 text-left border">Soni</th>
                  </tr>
                </thead>
                <tbody>
                  {excelData.map((b, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-3 border">{b.name}</td>
                      <td className="p-3 border">{b.author}</td>
                      <td className="p-3 border">{b.publisher}</td>
                      <td className="p-3 border">{b.year}</td>
                      <td className="p-3 border text-center">
                        {b.quantity_in_library}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowExcel(false)}
                disabled={excelLoading}
                className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded disabled:opacity-50"
              >
                Bekor
              </button>
              <button
                onClick={confirmExcelImport}
                disabled={excelLoading}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {excelLoading ? (
                  <>
                    <IconLoader2 className="animate-spin" /> Qo'shilmoqda...
                  </>
                ) : (
                  "Hammasini qo'shish"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitoblarPage;
