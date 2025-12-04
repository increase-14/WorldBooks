import { create } from "zustand";

const BASE_URL = "https://org-ave-jimmy-learners.trycloudflare.com";

const useAppStore = create((set) => ({
  libraries: [],
  books: [],
  currentLibrary: null,
  currentLibraryBooks: [],
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
    } catch (err) {
      set({ error: "Kutubxonalar yuklanmadi" });
    } finally {
      set({ loadingLibraries: false });
    }
  },

  loadBooks: async () => {
    set({ loadingBooks: true, error: null });
    try {
      const res = await fetch(`${BASE_URL}/api/v1/books/books/`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.results || [];
      set({ books: list });
    } catch (err) {
      set({ error: "Kitoblar yuklanmadi" });
    } finally {
      set({ loadingBooks: false });
    }
  },

  loadLibraryDetail: async (id) => {
    set({
      loadingLibraryDetail: true,
      currentLibrary: null,
      currentLibraryBooks: [],
      error: null,
    });

    try {
      const libRes = await fetch(`${BASE_URL}/api/v1/libraries/library/${id}/`);
      if (!libRes.ok) throw new Error("Kutubxona topilmadi");
      const library = await libRes.json();

      const booksRes = await fetch(
        `${BASE_URL}/api/v1/libraries/library/books/?library=${id}`
      );
      let books = [];
      if (booksRes.ok) {
        const data = await booksRes.json();
        books = Array.isArray(data) ? data : data.results || [];
      }

      set({ currentLibrary: library, currentLibraryBooks: books });
    } catch (err) {
      set({
        error: "Ma'lumotlar yuklanmadi",
        currentLibrary: null,
        currentLibraryBooks: [],
      });
    } finally {
      set({ loadingLibraryDetail: false });
    }
  },

  loadBookDetail: async (id) => {
    set({ loadingBookDetail: true, currentBook: null, error: null });
    try {
      const res = await fetch(`${BASE_URL}/api/v1/books/book/${id}/`);
      if (!res.ok) throw new Error("Kitob topilmadi");
      const book = await res.json();
      set({ currentBook: book });
    } catch (err) {
      set({ error: err.message, currentBook: null });
    } finally {
      set({ loadingBookDetail: false });
    }
  },

  clearLibraryDetail: () =>
    set({ currentLibrary: null, currentLibraryBooks: [] }),
  clearBookDetail: () => set({ currentBook: null }),
}));

export default useAppStore;
