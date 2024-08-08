import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface LoginState {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}
export const useLoginStore = create<LoginState>()(
  devtools((set) => ({
    isLogin: false,
    setIsLogin: (isLogin) => set(() => ({ isLogin })),
  })),
);
