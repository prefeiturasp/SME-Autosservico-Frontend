export type UsersByPageEntry = {
  path: string;
  currentUsers: number;
  averageUsers: number;
};

export type UsersByPageResponse = {
  system: string;
  pages: UsersByPageEntry[];
};
