export const MenuList = {
  BADGE: "badge",
  BADGES: "badges",
  FEMALE: "female",
  MALE: "male",
  REVISION: "revision",
  TIP: "tips",
} as const;

export type MenuListType = (typeof MenuList)[keyof typeof MenuList];

export const MENU = [
  {
    id: MenuList.BADGE,
    label: "Badges",
    children: [
      { id: MenuList.BADGES, label: "Badges", active: true },
      { id: MenuList.FEMALE, label: "Female", active: true },
      { id: MenuList.MALE, label: "Male", active: true },
      { id: MenuList.REVISION, label: "Revision", active: true },
      { id: MenuList.TIP, label: "Tips", active: true },
    ],
    active: true,
  },
  { id: "categories", label: "Categories", children: [], active: false },
  { id: "interview", label: "Interview", children: [], active: false },
  { id: "jobs", label: "Jobs", children: [], active: false },
  { id: "keywords", label: "Keywords", children: [], active: false },
  { id: "profile", label: "Profile", children: [], active: false },
  { id: "tip", label: "Tips", children: [], active: false },
  { id: "user_status", label: "UserStatus", children: [], active: false },
];

export interface MenuType {
  id: string;
  label: string;
  children?: MenuType[];
  active: boolean;
}
