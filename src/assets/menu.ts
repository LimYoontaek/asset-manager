export const MENU = [
  {
    id: "badge",
    label: "Badge",
    children: [
      { id: "badges", label: "Badges", active: true },
      { id: "female", label: "Female", active: true },
      { id: "male", label: "Male", active: true },
      { id: "revision", label: "Revision", active: true },
      { id: "tip", label: "Tips", active: true },
    ],
    active: true,
  },
  { id: "categories", label: "Categories", children: [], active: false },
  { id: "interview", label: "Interview", children: [], active: false },
  { id: "jobs", label: "Jobs", children: [], active: false },
  { id: "keywords", label: "Keywords", children: [], active: false },
  { id: "profile", label: "Profile", children: [], active: false },
  { id: "tips", label: "Tips", children: [], active: false },
  { id: "user_status", label: "UserStatus", children: [], active: false },
];

export interface MenuType {
  id: string;
  label: string;
  children?: MenuType[];
  active: boolean;
}
