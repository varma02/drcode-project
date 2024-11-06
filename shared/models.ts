
export interface JWTData {
  user: string,
  session_key: string,
  user_agent: string,
}

export interface User {
  id: string,
  name: string,
  email: string,
  created: Date,
  role: Role,
  // Only possible on server side
  session_key?: string,
  password?: string,
}

export type Permission = 
  "teacher" |
  "view_knowledge" |
  "view_timetable" |
  "manage_knowledge" |
  "manage_roles" |
  "manage_timetable" |
  "manage_users";

export interface Role {
  id: string,
	name: string,
	permissions?: Permission[],
}