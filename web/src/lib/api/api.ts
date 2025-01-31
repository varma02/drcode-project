import axios from "axios";
import { API_URL, defaultTimeout } from "./constants";


// MARK: Auth

export async function register(invite_id: string, name: string, email: string, password: string) {
  return (
    await axios.post(
      API_URL + "/auth/register",
      { invite_id, name, email, password },
      { timeout: defaultTimeout }
    )
  ).data;
}

export async function updateUser(token: string, data: { name?: string, email?: string, new_password?: string, old_password: string }) {
  return (
    await axios.post(
      API_URL + "/auth/update",
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

// MARK: Employee

export async function getAllEmployees(token: string) {
  return (
    await axios.get(
      API_URL + "/employee/all",
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function getEmployee(token: string, ...ids: string[]) {
  return (
    await axios.get(
      API_URL + "/employee/get",
      {
        params: { ids: ids.join(",") },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function getEmployeeWithDetails(token: string, ...ids: string[]) {
  return (
    await axios.get(
      API_URL + "/employee/get",
      {
        params: {
          ids: ids.join(","),
          include: "groups,unpaid_work"
        },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function removeEmployee(token: string, id: string) {
  return (
    await axios.post(
      API_URL + "/employee/remove",
      {
        params: { id },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function updateEmployee(token: string, id: string, name: string, email: string, roles: string[]) {
  return (
    await axios.post(
      API_URL + "/employee/remove",
      {
        params: { id, name, email, roles },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

// MARK: Group

export async function getAllGroups(token: string) {
  return (
    await axios.get(
      API_URL + "/group/all",
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function getGroup(token: string, ...ids: string[]) {
  return (
    await axios.get(
      API_URL + "/group/get",
      {
        params: { ids: ids.join(",") },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function getGroupWithDetails(token: string, ...ids: string[]) {
  return (
    await axios.get(
      API_URL + "/group/get",
      {
        params: {
          ids: ids.join(","),
          include: "lessons,subjects,enroled"
        },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function createGroup(token: string, name: string, location: string, teachers: string[], notes: string, lessons: object[]) {
  return (
    await axios.post(
      API_URL + "/group/create",
      { name, location, teachers, notes, lessons },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function updateGroup(token: string, id: string, name: string, location: string, teachers: string[], notes: string, archived: boolean) {
  return (
    await axios.post(
      API_URL + "/group/update",
      { id, name, location, teachers, notes, archived },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function removeGroup(token: string, id: string) {
  return (
    await axios.post(
      API_URL + "/group/remove",
      { id },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

// MARK: Location

export async function getAllLocations(token: string) {
  return (
    await axios.get(
      API_URL + "/location/all",
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}


export async function getLocation(token: string, ...ids: string[]) {
  return (
    await axios.get(
      API_URL + "/location/get",
      {
        params: { ids: ids.join(",") },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function createLocation(token: string, name: string, address: string, contact_email: string, contact_phone: string, notes: string) {
  return (
    await axios.post(
      API_URL + "/location/create",
      { name, address, contact_email, contact_phone, notes },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function updateLocation(token: string, id: string, name: string, address: string, contact_email: string, contact_phone: string, notes: string) {
  return (
    await axios.post(
      API_URL + "/location/update",
      { id, name, address, contact_email, contact_phone, notes },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function removeLocation(token: string, id: string) {
  return (
    await axios.post(
      API_URL + "/location/remove",
      { id },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

// MARK: Lesson

export async function getAllLessons(token: string) {
  return (
    await axios.get(
      API_URL + "/lesson/all",
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function getAllLessonsBetweenDates(token: string, start: Date, end: Date) {
  return (
    await axios.get(
      API_URL + "/lesson/between_dates",
      {
        params: { start: start.toISOString(), end: end.toISOString() },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function getLesson(token: string, ids: string[]) {
  return (
    await axios.get(
      API_URL + "/lesson/get",
      {
        params: { ids: ids.join(",") },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function createLesson(token: string, start: Date, end: Date, name: string, location: string, teacher: string[], notes: string, group: string) {
  return (
    await axios.post(
      API_URL + "/lesson/create",
      {
        params: { start, end, name, location, teacher, notes, group },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function updateLesson(token: string, id: string, start: Date, end: Date, name: string, location: string, teacher: string[], notes: string, group: string) {
  return (
    await axios.post(
      API_URL + "/lesson/update",
      {
        params: { id, start, end, name, location, teacher, notes, group },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function removeLesson(token: string, id: string) {
  return (
    await axios.post(
      API_URL + "/lesson/remove",
      {
        params: { id },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

// MARK: Subject

export async function getAllSubjects(token: string) {
  return (
    await axios.get(
      API_URL + "/subject/all",
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function getSubject(token: string, ...ids: string[]) {
  return (
    await axios.get(
      API_URL + "/subject/get",
      {
        params: { ids: ids.join(",") },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function createSubject(token: string, name: string, notes: string) {
  return (
    await axios.post(
      API_URL + "/subject/create",
      { name, notes },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function updateSubject(token: string, id: string, name: string, notes: string) {
  return (
    await axios.post(
      API_URL + "/subject/update",
      { id, name, notes },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function removeSubject(token: string, id: string) {
  return (
    await axios.post(
      API_URL + "/subject/remove",
      { id },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

// MARK: Student

export async function getAllStudents(token: string) {
  return (
    await axios.get(
      API_URL + "/student/all",
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function getStudent(token: string, ...ids: string[]) {
  return (
    await axios.get(
      API_URL + "/student/get",
      {
        params: { ids: ids.join(",") },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function getStudentWithDetails(token: string, ...ids: string[]) {
  return (
    await axios.get(
      API_URL + "/student/get",
      {
        params: {
          include: "enroled",
          ids: ids.join(","),
        },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function createStudent(token: string, name: string, grade: number, email: string, phone: string, parent: object, notes: string) {
  return (
    await axios.post(
      API_URL + "/student/create",
      { name, grade, email, phone, parent, notes },
      {
        headers: { Authorization: `Bearer ${token}`},
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function updateStudent(token: string, data: { id: string, name: string, email: string, phone: string, notes: string, parent: { name: string, email: string, phone: string } }) {
  return (
    await axios.post(
      API_URL + "/student/update",
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function removeStudent(token: string, id: string) {
  return (
    await axios.post(
      API_URL + "/student/remove",
      {
        params: { id },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

// MARK: Message

export async function getGlobalMessages(token: string, page: number = 1, limit: number = 50) {
  return (
    await axios.get(
      API_URL + "/message/received",
      {
        params: {
          include: "global",
          limit,
          page,
        },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function getMessages(token: string, ids: string[], page: number = 1, limit: number = 50) {
  return (
    await axios.get(
      API_URL + "/message/received",
      {
        params: {
          ids: ids.join(","),
          include: "global",
          limit,
          page,
        },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function sendMessage(token: string, text: string, recipient?: string, reply_to?: string) {
  return (
    await axios.post(
      API_URL + "/message/create",
      { text, recipient, reply_to },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function updateMessage(token: string, id: string, text: string) {
  return (
    await axios.post(
      API_URL + "/message/update",
      { id, text },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function removeMessage(token: string, id: string) {
  return (
    await axios.post(
      API_URL + "/message/remove",
      { id },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

// MARK: Invite

export async function getAllInvites(token: string) {
  return (
    await axios.get(
      API_URL + "/invite/all",
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function createInvite(token: string, roles: string[]) {
  return (
    await axios.post(
      API_URL + "/invite/create",
      { roles },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function removeInvite(token: string, id: string) {
  return (
    await axios.post(
      API_URL + "/invite/remove",
      { id },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}
