export interface AccountJWT {
  employee_id: string,
  session_key: string,
  user_agent: string,
}

export enum DBRole {
  Admin = "administrator",
  Teacher = "teacher"
};

export interface DBEmployee {
  id: string,
  created: Date,
  name: string,
  email: string,
  password?: string,
  roles: DBRole[],
  session_key?: string,
}

export interface DBInvite {
  id: string,
  created: Date,
  author: string | DBEmployee,
  roles: DBRole[],
}

export interface DBFile {
  id: string,
  created: Date,
  author: string | DBEmployee,
  name: string,
  mime_type: string,
  size: number,
  path: string,
  shared_with: string[] | DBEmployee[],
}

export interface DBSubject {
  id: string,
  created: Date,
  name: string,
  notes: string,
}

export interface DBStudent {
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

export interface DBLocation {
  id: string,
  created: Date,
  name: string,
  notes: string,
  address: string,
  contact_email: string,
  contact_phone: string,
}

export interface DBGroup {
  id: string,
  created: Date,
  location: DBLocation,
  notes: string,
  teachers: string[] | DBEmployee[],
  archived: boolean,
}

export interface DBRelationEnroled {
  id: string,
  in: string | DBStudent,
  out: string | DBGroup,
  created: Date,
  subject: string | DBSubject,
  price: number,
  notes: string,
}

export interface DBLesson {
  id: string,
  created: Date,
  name?: string
  group?: string | DBGroup,
  location?: string | DBLocation,
  notes: string,
  teachers?: string[] | DBEmployee[],
  start: Date,
  end: Date,
}

export interface DBRelationReplaced {
  id: string,
  in: string | DBStudent,
  out: string | DBLesson,
  created: Date,
  notes: string,
  replacement: string | DBLesson,
}

export interface DBRelationAttended {
  id: string,
  in: string | DBStudent,
  out: string | DBLesson | DBRelationReplaced,
  created: Date,
  paid: boolean,
}

export interface DBRelationWorkedAt {
  id: string,
  in: string | DBEmployee,
  out: string | DBLesson,
  created: Date,
  paid: boolean,
  notes: string,
  start?: Date,
  end?: Date,
}

export interface DBMessage {
  id: string,
  created: Date,
  text: string,
  author: string | DBEmployee,
  recipient?: string | DBEmployee,
  reply_to?: string | DBMessage,
}