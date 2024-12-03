export interface JWTData {
  employee_id: string,
  session_key: string,
  user_agent: string,
}

export type Permission = 
  "administrator" |
  "teacher";

export interface Employee {
  id: string,
  created: Date,
  name: string,
  email: string,
  roles: Permission[],
  password?: string,
  session_key?: string,
}

export interface Invite {
  id: string,
  created: Date,
  author: string | Employee,
}

export interface Event {
  id: string,
  created: Date,
  author: string | Employee,
  name: string,
  signups: Employee[]
  signup_limit: number,
  start: Date,
  end: Date,
}