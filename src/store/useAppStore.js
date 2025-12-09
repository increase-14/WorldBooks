import { create } from "zustand";
import axios from "axios";

const BASE_URL = "https://org-ave-jimmy-learners.trycloudflare.com";

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
      const { data } = await api.get("/api/v1/libraries/libraries/");
      set({ libraries: Array.isArray(data) ? data : data.results || [] });
    } catch {
      set({ error: "Kutubxonalar yuklanmadi" });
    } finally {
      set({ loadingLibraries: false });
    }
  },

  loadBooks: async () => {
    set({ loadingBooks: true, error: null });
    try {
      const { data } = await api.get("/api/v1/books/books/");
      set({ books: Array.isArray(data) ? data : data.results || [] });
    } catch {
      set({ error: "Kitoblar yuklanmadi" });
    } finally {
      set({ loadingBooks: false });
    }
  },

  addBook: async (book) => {
    set({ loadingBooks: true, error: null });
    try {
      const { data } = await api.post("/api/v1/books/books/", book);
      set({ books: [...get().books, data] });
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
      await api.delete(`/api/v1/books/book/${id}/`);
      set({ books: get().books.filter((b) => b.id !== id) });
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loadingBooks: false });
    }
  },

  loadLibraryDetail: async (id) => {
    set({ loadingLibraryDetail: true, error: null, currentLibrary: null });
    try {
      const { data } = await api.get(`/api/v1/libraries/library/${id}/`);
      set({ currentLibrary: data });
    } catch {
      set({ error: "Kutubxona topilmadi", currentLibrary: null });
    } finally {
      set({ loadingLibraryDetail: false });
    }
  },

  loadBookDetail: async (id) => {
    set({ loadingBookDetail: true, error: null, currentBook: null });
    try {
      const { data } = await api.get(`/api/v1/books/book/${id}/`);
      set({ currentBook: data });
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
