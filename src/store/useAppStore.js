import { create } from "zustand";
import { api } from "../api/API";

const useAppStore = create((set) => ({
  books: [],
  currentBook: null,
  loadingBooks: false,
  loadingBookDetail: false,
  error: null,

  loadBooks: async () => {
    set({ loadingBooks: true, error: null });
    try {
      const res = await api.get("/api/v1/books/books/");
      set({ books: res.data.results || res.data });
    } catch (err) {
      set({ error: "Kitoblar yuklanmadi" });
    } finally {
      set({ loadingBooks: false });
    }
  },

  loadBookDetail: async (id) => {
    set({ loadingBookDetail: true, currentBook: null, error: null });
    try {
      const res = await api.get(`/api/v1/books/book/${id}/`);
      set({ currentBook: res.data });
    } catch (err) {
      set({ error: "Kitob topilmadi", currentBook: null });
    } finally {
      set({ loadingBookDetail: false });
    }
  },

  addBook: async (bookData) => {
    try {
      const res = await api.post("/api/v1/books/books/", bookData);
      set((state) => ({ books: [...state.books, res.data] }));
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  updateBook: async (id, bookData) => {
    try {
      const res = await api.put(`/api/v1/books/book/${id}/`, bookData);
      set((state) => ({
        books: state.books.map((b) => (b.id === id ? res.data : b)),
      }));
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  deleteBook: async (id) => {
    try {
      await api.delete(`/api/v1/books/book/${id}/`);
      set((state) => ({ books: state.books.filter((b) => b.id !== id) }));
    } catch (err) {
      throw err;
    }
  },

  clearBookDetail: () => set({ currentBook: null }),
}));

export default useAppStore;
