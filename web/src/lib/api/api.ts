import axios from "axios";
import { API_URL } from "./constants";

export async function getAllEmployees(token:string) {
  return (await axios.get(API_URL + "/employee/all", {headers: {Authorization: `Bearer ${token}`}, timeout: 2000})).data;
}