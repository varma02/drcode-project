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

export async function getEmployeeWithDetails(token: string, ids: string[], details: string[]) {
  return (
    await axios.get(
      API_URL + "/employee/get",
      {
        params: { ids: ids.join(","), include: details.join(",") },
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