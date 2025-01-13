export interface JWTData {
  employee_id: string,
  session_key: string,
  user_agent: string,
}

export type Role = 
  "administrator" |
  "teacher";

export interface Employee {
  id: string,
  created: Date,
  name: string,
  email: string,
  password?: string,
  roles: Role[],
  session_key?: string,
}

export interface Invite {
  id: string,
  created: Date,
  author: string | Employee,
  roles: Role[],
}

export interface DEvent {
  id: string,
  created: Date,
  author: string | Employee,
  location?: string | Location,
  name: string,
  notes: string,
  signups: string[] | Employee[],
  signup_limit: number,
  start: Date,
  end: Date,
}

export interface Subject {
  id: string,
  created: Date,
  name: string,
  notes: string,
}

export interface Student {
  id: string,
  created: Date,
  name: string,
  parent?: {
    name: string,
    email: string,
    phone: string,
  },
  email?: string,
  phone?: string,
  extra_fields: {[key: string]: string},
  notes: string,
}

export interface Location {
  id: string,
  created: Date,
  name?: string,
  notes: string,
  address: string,
  contact_email: string,
  contact_phone: string,
}

export interface Group {
  id: string,
  created: Date,
  location: Location,
  notes: string,
  teachers: string[] | Employee[],
  archived: boolean,
}

export interface RelationEnroled {
  id: string,
  in: string | Student,
  out: string | Group,
  created: Date,
  subject: string | Subject,
  price: number,
  notes: string,
}

export interface Lesson {
  id: string,
  created: Date,
  name?: string
  group?: string | Group,
  location?: string | Location,
  notes: string,
  teachers?: string[] | Employee[],
  start: Date,
  end: Date,
}

export interface RelationReplaced {
  id: string,
  in: string | Student,
  out: string | Lesson,
  created: Date,
  notes: string,
  replacement: string | Lesson,
}

export interface RelationAttended {
  id: string,
  in: string | Student,
  out: string | Lesson | RelationReplaced,
  created: Date,
  paid: boolean,
}

export interface RelationWorkedAt {
  id: string,
  in: string | Employee,
  out: string | Lesson | DEvent,
  created: Date,
  paid: boolean,
  notes: string,
  start?: Date,
  end?: Date,
}