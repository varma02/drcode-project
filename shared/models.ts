
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
}

export interface Role {
  id: string,
	name: string,
	teacher: boolean,
	view_knowledge: boolean,
	view_timetable: boolean,
	manage_knowledge: boolean,
	manage_roles: boolean,
	manage_timetable: boolean,
	manage_users: boolean,
}