export type AppRole = "admin" | "moderator" | "user";
export type AppPermission =
  | "channels.select"
  | "channels.delete"
  | "messages.select"
  | "messages.delete";
export type UserStatus = "ONLINE" | "OFFLINE";

export type Channel = {
  id: number;
  slug: string;
  created_by: string;
  inserted_at: string;
};

export type Message = {
  id: number;
  message: string;
  user_id: string;
  channel_id: number;
  inserted_at: string;

  author?: User;
};

export type RolePermission = {
  id: number;
  role: AppRole;
  permission: AppPermission;
};

export type UserRole = {
  id: number;
  user_id: string;
  role: string;
  channel_id: number;
};

export type User = {
  id: string;
  username: string;
  status: UserStatus;
};
