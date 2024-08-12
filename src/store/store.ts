import { create, StoreApi, UseBoundStore } from "zustand";
import { devtools } from "zustand/middleware";

interface LoginState {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

interface MenuState {
  selectedMenu: number;
  setMenu: (menu: number) => void;
}
const useLoginStoreBase = create<LoginState>()(
  devtools((set) => ({
    isLogin: false,
    setIsLogin: (isLogin) => set(() => ({ isLogin })),
  })),
);
const useMenuStoreBase = create<MenuState>()(
  devtools((set) => ({
    selectedMenu: 0,
    setMenu: (menu: number) =>
      set(() => ({
        selectedMenu: menu,
      })),
  })),
);
type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const useLoginStore = createSelectors(useLoginStoreBase);
export const useMenuStore = createSelectors(useMenuStoreBase);
