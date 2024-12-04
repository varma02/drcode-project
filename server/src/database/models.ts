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

export interface Subject {
  id: string,
  created: Date,
  name: string,
  description: string,
  suggested_lesson_count: number,
}

export interface Student {
  id: string,
  created: Date,
  name: string,
  email: string,
  phone: string,
  parent?: {
    name: string,
    email: string,
    phone: string,
  },
  extra_fields: {[key: string]: string},
  notes?: string,
}

export interface Class {
  id: string,
  created: Date,
  location: {
    name: string,
    address: string,
    contact_email: string,
    contact_phone: string,
  },
  notes?: string,
  teachers: Employee[],
  archived: boolean,
}

export interface RelationEnroled {
  id: string,
  in: string | Student,
  out: string | Class,
  created: Date,
  subject: string | Subject,
  price: number,
  notes?: string,
}

export interface Lesson {
  id: string,
  created: Date,
  class: string | Class,
  notes?: string,
  teachers?: Employee[],
  start: Date,
  end: Date,
}

export interface RelationAttended {
  id: string,
  in: string | Student,
  out: string | Lesson,
  created: Date,
}

export interface RelationWorkedAt {
  id: string,
  in: string | Employee,
  out: string | Lesson | Event,
  created: Date,
  paid: boolean,
  notes?: string,
}