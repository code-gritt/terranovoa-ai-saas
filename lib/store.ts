// lib/store.ts
import { create } from "zustand";

type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
