import { BadgeType, GenderBadgeType, TipsType } from "./../types/badges";
import { MenuList, MenuListType } from "@src/assets/menu";
import { BadgeUnionType } from "@src/types/badges";
import { create, StoreApi, UseBoundStore } from "zustand";
import { devtools } from "zustand/middleware";

interface LoginState {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}
interface MenuState {
  selectedMenu: MenuListType;
  setMenu: (menu: MenuListType) => void;
}

export interface JsonDataType {
  badges: BadgeType[];
  female: GenderBadgeType[];
  male: GenderBadgeType[];
  revision: number;
  tips: TipsType;
}
interface JsonDataState {
  json: JsonDataType | null;
  target: string;
  setJsonData: (data: JsonDataType) => void;
  addJsonData: (data: BadgeUnionType) => void;
  updateSelectedData: (data: BadgeUnionType, idx: number) => void;
  deleteSelectedData: (idx: number) => void;
  setTarget: (target: string) => void;
}

interface SelectedDataState {
  selectedBadge: BadgeUnionType | null;
  selectedIndex: number;
  setSelectedBadge: (badge: BadgeUnionType) => void;
  setSelectedIndex: (idx: number) => void;
  resetSelectedData: () => void;
}

const useLoginStoreBase = create<LoginState>()(
  devtools((set) => ({
    isLogin: false,
    setIsLogin: (isLogin) => set(() => ({ isLogin })),
  })),
);
const useMenuStoreBase = create<MenuState>()(
  devtools((set) => ({
    selectedMenu: MenuList.BADGES,
    setMenu: (menu: MenuListType) =>
      set(() => ({
        selectedMenu: menu,
      })),
  })),
);

const initialJsonData = {
  json: null,
};
const useJsonDataBase = create<JsonDataState>()(
  devtools((set) => ({
    json: null,
    target: "",
    setJsonData: (data: JsonDataType) => set(() => ({ json: data })),
    addJsonData: (data: BadgeUnionType) =>
      set((state) => {
        if (!state.json) return { ...state };

        const currentMenu = useMenuStoreBase.getState().selectedMenu;
        switch (currentMenu) {
          case MenuList.BADGES: {
            return {
              json: {
                ...state.json,
                [useMenuStoreBase.getState().selectedMenu]: [
                  ...state.json[currentMenu],
                  data as BadgeType,
                ],
              },
            };
          }
          default:
            return { ...state };
        }
      }),
    updateSelectedData: (data: BadgeUnionType, idx: number) =>
      set((state) => {
        console.log(state);
        if (!state.json) return { ...state };

        const currentMenu = useMenuStoreBase.getState().selectedMenu;
        switch (currentMenu) {
          case MenuList.BADGES: {
            const currentData = state.json[currentMenu].slice();
            currentData.splice(idx, 1, data as BadgeType);
            return {
              json: {
                ...state.json,
                [useMenuStoreBase.getState().selectedMenu]: currentData,
              },
            };
          }
          case MenuList.FEMALE:
          case MenuList.MALE: {
            const currentData = state.json[currentMenu].slice();
            currentData.splice(idx, 1, data as GenderBadgeType);
            return {
              json: {
                ...state.json,
                [useMenuStoreBase.getState().selectedMenu]: currentData,
              },
            };
          }
          case MenuList.REVISION:
          case MenuList.TIP: {
            const newData = {
              json: {
                ...state.json,
                [useMenuStoreBase.getState().selectedMenu]: data,
              },
            };
            console.log(newData);
            return newData;
          }
          default:
            return initialJsonData;
        }
      }),
    deleteSelectedData: (idx: number) =>
      set((state) => {
        if (!state.json) return { ...state };

        const currentMenu = useMenuStoreBase.getState().selectedMenu;
        switch (currentMenu) {
          case MenuList.BADGES: {
            const currentData: BadgeType[] = [...state.json[currentMenu]];
            currentData.splice(idx, 1);
            return {
              json: {
                ...state.json,
                [useMenuStoreBase.getState().selectedMenu]: currentData,
              },
            };
          }
          default:
            return { ...state };
        }
      }),
    setTarget: (target: string) => set(() => ({ target })),
  })),
);

const initialSelectedData = {
  selectedBadge: null,
  selectedIndex: 0,
};
const useSelectedDataStoreBase = create<SelectedDataState>()(
  devtools((set) => ({
    ...initialSelectedData,
    setSelectedBadge: (badge: BadgeUnionType) =>
      set(() => ({ selectedBadge: badge })),
    setSelectedIndex: (idx: number) => set(() => ({ selectedIndex: idx })),
    resetSelectedData: () => {
      set(initialSelectedData);
    },
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
export const useJsonDataStore = createSelectors(useJsonDataBase);
export const useSelectedDataStore = createSelectors(useSelectedDataStoreBase);
