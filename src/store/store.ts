import { create } from "zustand";

interface LoginState {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}
export const useLoginStore = create<LoginState>((set) => ({
  isLogin: false,
  setIsLogin: (isLogin) => set(() => ({ isLogin })),
}));
