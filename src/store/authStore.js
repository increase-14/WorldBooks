import { create } from "zustand";
import { persist } from "zustand/middleware";

const authStore = create(
  persist(
    (set) => ({
      user: null,
      access: null,
      refresh: null,
      isAuth: false,

      login: (user, access, refresh) => {
        localStorage.setItem("token", access);
        set({ user, access, refresh, isAuth: true });
      },

      logout: () => {
        localStorage.removeItem("token"); 
        set({ user: null, access: null, refresh: null, isAuth: false });
      },
    }),
    { name: "auth-store" }
  )
);

export default authStore;
