export interface BadgeType {
  age?: number;
  "attach-file"?: AttachFileType;
  examples?: string[];
  gender?: number;
  id: number;
  method: MethodType[];
  name: string;
  standard?: string;
  "sub-title": string;
  title: string;
  hasCaution?: boolean;
  "simple-verify"?: SimpleVerifyType;
  message?: string;
  verified?: string[];
}

interface AttachFileType {
  "agree-resident-egistration"?: boolean;
  condition: number;
  max?: number;
}

interface MethodType {
  contents?: string[];
  method?: MethodType[];
  "contents-required"?: boolean;
  required: boolean;
  title: string;
}

interface SimpleVerifyType {
  used: boolean;
  "show-mark-badge-list": boolean;
  title: string;
  "badge-url": string;
  "small-badge-url": string;
}

export const defaultBadgeData = {
  age: 0,
  "attach-file": {
    "agree-resident-egistration": false,
    condition: 1,
  },
  examples: [""],
  gender: 0,
  id: 0,
  method: [
    {
      required: false,
      title: "",
    },
    {
      method: [
        {
          contents: [
            {
              contents: [],
              required: false,
              title: "",
            },
          ],
          required: false,
          title: "",
        },
      ],
      required: false,
      title: "",
    },
  ],
  name: "",
  standard: "",
  "sub-title": "",
  title: "",
  hasCaution: false,
  "simple-verify": {
    used: false,
    "show-mark-badge-list": false,
    title: "",
    "badge-url": "",
    "small-badge-url": "",
  },
  message: "",
  verified: [],
};

export interface GenderBadgeType {
  badges: number[];
  register?: number;
  "show-mark-badge-list"?: boolean;
  title: string;
}

export interface RevisionType {
  revision: number;
}

export interface TipsType {
  approved: string;
  rejected: string;
  requested: string;
}

export type BadgeJsonType =
  | BadgeType[]
  | GenderBadgeType[]
  | RevisionType
  | TipsType;

export type BadgeUnionType =
  | BadgeType
  | GenderBadgeType
  | RevisionType
  | TipsType;
