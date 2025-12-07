import { create } from "zustand";

const BASE_URL = "https://org-ave-jimmy-learners.trycloudflare.com";

const useAppStore = create((set, get) => ({
  libraries: [],
  books: [],
  currentLibrary: null,
  currentBook: null,

  loadingLibraries: false,
  loadingBooks: false,
  loadingLibraryDetail: false,
  loadingBookDetail: false,

  error: null,

  loadLibraries: async () => {
    set({ loadingLibraries: true, error: null });
    try {
      const res = await fetch(`${BASE_URL}/api/v1/libraries/libraries/`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.results || [];
      set({ libraries: list });
    } catch {
      set({ error: "Kutubxonalar yuklanmadi" });
    } finally {
      set({ loadingLibraries: false });
    }
  },

  loadBooks: async () => {
    set({ loadingBooks: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/v1/books/books/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.results || [];
      set({ books: list });
    } catch {
      set({ error: "Kitoblar yuklanmadi" });
    } finally {
      set({ loadingBooks: false });
    }
  },

  addBook: async (book) => {
    set({ loadingBooks: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/v1/books/books/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(book),
      });

      if (!res.ok) throw new Error("Kitob qo'shilmadi");

      const newBook = await res.json();
      set({ books: [...get().books, newBook] });
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loadingBooks: false });
    }
  },

  deleteBook: async (id) => {
    set({ loadingBooks: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/v1/books/book/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) throw new Error("Kitob o'chirilmadi");

      set({ books: get().books.filter((b) => b.id !== id) });
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loadingBooks: false });
    }
  },

  loadLibraryDetail: async (id) => {
    set({ loadingLibraryDetail: true, currentLibrary: null, error: null });
    try {
      const res = await fetch(`${BASE_URL}/api/v1/libraries/library/${id}/`);
      if (!res.ok) throw new Error("Kutubxona topilmadi");
      const library = await res.json();
      set({ currentLibrary: library });
    } catch {
      set({ error: "Ma'lumotlar yuklanmadi", currentLibrary: null });
    } finally {
      set({ loadingLibraryDetail: false });
    }
  },

  loadBookDetail: async (id) => {
    set({ loadingBookDetail: true, currentBook: null, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/v1/books/book/${id}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error("Kitob topilmadi");
      const book = await res.json();
      set({ currentBook: book });
    } catch (err) {
      set({ error: err.message, currentBook: null });
    } finally {
      set({ loadingBookDetail: false });
    }
  },

  clearLibraryDetail: () => set({ currentLibrary: null }),
  clearBookDetail: () => set({ currentBook: null }),
}));

export default useAppStore;
