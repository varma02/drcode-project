import axios from "axios";
import { API_URL, defaultTimeout } from "./constants";

export async function getAllEmployees(token:string) {
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

export async function createGroup(token: string, name:string, location:string, teachers:string[], notes:string, lessons:object[]) {
  return (
    await axios.post(
      API_URL + "/group/create", 
      {name, location, teachers, notes, lessons}, 
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

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

export async function register(invite_id: string, name: string, email:string, password:string) {
  return (
    await axios.post(
      API_URL + "/auth/register", 
      { invite_id, name, email, password }, 
      { timeout: defaultTimeout }
    )
  ).data;
}

export async function updateUser(token: string, data: { name?:string, email?:string, new_password?:string, old_password:string }) {
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

export async function updateStudent(token: string, data: { id: string, name: string, email: string, phone: string, notes: string, parent: {name: string, email: string, phone: string} }) {
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

export async function getGlobalMessages(token: string, page: number = 1) {
  return (
    await axios.get(
      API_URL + "/message/received", 
      {
        params: {
          include: "global",
          limit: 50,
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