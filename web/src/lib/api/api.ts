import axios from "axios";
import { API_URL } from "./constants";

export async function getAllEmployees(token:string) {
  return (await axios.get(API_URL + "/employee/all", {headers: {Authorization: `Bearer ${token}`}, timeout: 2000})).data;
}

export async function getEmployee(token: string, id: string) {
  return (await axios.get(API_URL + "/employee/"+id, {headers: {Authorization: `Bearer ${token}`}, timeout: 2000})).data;
}

export async function getAllGroups(token: string) {
  return (await axios.get(API_URL + "/group/all", {headers: {Authorization: `Bearer ${token}`}, timeout: 2000})).data;
}

export async function getGroup(token: string, id: string) {
  return (await axios.get(API_URL + "/group/"+id, {headers: {Authorization: `Bearer ${token}`}, timeout: 2000})).data;
}

export async function createGroup(token: string, name:string, location:string, teachers:string[], notes:string, lessons:object[]) {
  return (await axios.post(API_URL + "/group/create", {name, location, teachers, notes, lessons}, {headers: {Authorization: `Bearer ${token}`}, timeout: 2000})).data;
}

export async function getAllLocations(token: string) {
  return (await axios.get(API_URL + "/location/all", {headers: {Authorization: `Bearer ${token}`}, timeout: 2000})).data;
}

export async function getLocation(token: string, id: string) {
  return (await axios.get(API_URL + "/location/"+id, {headers: {Authorization: `Bearer ${token}`}, timeout: 2000})).data;
}