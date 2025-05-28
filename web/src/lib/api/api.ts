import axios from "axios";
import { API_URL, defaultTimeout } from "./constants";


export const endpoints = ["auth", "employee", "location", "subject", "student", "lesson", "invite", "group", "enrolment", "file", "worksheet", "replacement"] as const;
export type Endpoint = typeof endpoints[number];

// MARK: Common

export async function getAll(token: string, endpoint: Endpoint, fetch?: string) {
  return (
    await axios.get(
      API_URL + `/${endpoint}/all`,
      {
        params: {
          fetch
        },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function get(token: string, endpoint: Endpoint, ids: string[], fetch?: string, include?: string) {
  return (
    await axios.get(
      API_URL + `/${endpoint}/get`,
      {
        params: { 
          ids: [...ids].join(","),
          include: include,
          fetch: fetch
        },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function update(token: string, endpoint: Endpoint, id: string, data: object) {
  return (
    await axios.post(
      API_URL + `/${endpoint}/update`,
      {...{ id, ...data }},
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function remove(token: string, endpoint: Endpoint, ids: string[]) {
  return (
    await axios.post(
      API_URL + `/${endpoint}/remove`,
      { ids },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function create(token: string, endpoint: Endpoint, data: object) {
  return (
    await axios.post(
      API_URL + `/${endpoint}/create`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}


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

// MARK: Lesson

export async function getAllLessonsBetweenDates(token: string, start: Date, end: Date, fetch?: string, include?: string) {
  return (
    await axios.get(
      API_URL + "/lesson/between_dates",
      {
        params: { 
          start: start.toISOString(), 
          end: end.toISOString(),
          include,
          fetch
        },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function attendLesson(token: string, lessonID: string, students: Array<string>) {
  return (
    await axios.post(
      API_URL + "/lesson/attendance",
      {
        id: lessonID,
        students
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

export async function getNextLesson(token: string, fetch?: string, include?: string) {
  return (
    await axios.get(
      API_URL + "/lesson/next",
      {
        params: { 
          include,
          fetch
        },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

// MARK: Worksheet

export async function getWorksheet(token: string, id: string, paid?: boolean, fetch?: string, include?: string) {
  return (
    await axios.get(
      API_URL + "/worksheet/get",
      {
        params: { 
          id,
          paid,
          include,
          fetch
        },
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}

// MARK: stats
export async function getStats(token: string) {
  return (
    await axios.get(
      API_URL + "/stats",
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: defaultTimeout
      }
    )
  ).data;
}