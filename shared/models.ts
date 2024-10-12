import Bitfield from "./Bitfield";

export interface User {
  id: string,
  email: string,
  name: string,
  created: Date,
  role: number,
}

export interface Session {
  id: string,
  user: User,
  created: Date,
  expires: Date,
  ip_address: string,
  user_agent: string,
}

export enum PermissionBits {
  teacher_dashboard = 1 << 0,
  admin_dashboard = 1 << 1,
  manage_users = 1 << 2,
  manage_roles = 1 << 3,
}

export interface Role {
  id: string,
  name: string,
  created: Date,
  permissions: Bitfield,
}

export interface Message {
  id: string,
  author: User,
  created: Date,
  content: string,
  type: number,
}