import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const role_map = {
  "administrator" : "Adminisztrátor",
  "teacher" : "Oktató",
}

export const route_map = {
  "": "Főoldal",
  calendar: "Beosztás", 
  worksheet: "Jelenléti ív", 
  employee: "Alkalmazottak", 
  students: "Tanulók", 
  groups: "Csoportok", 
  lessons: "Órák", 
  locations: "Helyszínek", 
  subjects: "Kurzusok", 
}

export function getTopRole(roles: string[] | Set<string>): string {
  roles = new Set(roles);
  if (roles.has("administrator")) return role_map.administrator;
  if (roles.has("teacher")) return role_map.teacher;
  return "Alkalmazott";
}

export function isAdmin(roles: string[]): boolean {
  return roles.includes("administrator")
}

export function getMonogram(name: string): string {
  return name.split(" ").slice(0, 2).map(v => v[0]).join("");
}

export function convertToMultiSelectData(data: Object[], displayKey = "name", valuekey = "id") : Object[] {
  return [...data.map(e => ({label:e[displayKey], value:e[valuekey]}) )];
}

export function generateLessons(startDate: Date, lessonCount: number, startTime: string, endTime: string) {
  const generated = []
  for (let index = 0; index < lessonCount; index++) {
    generated.push(
      {
        start: new Date(new Date(`${startDate}T${startTime}`).setDate(new Date(`${startDate}T${startTime}`).getDate() + index * 7)).toISOString(),
        end: new Date(new Date(`${startDate}T${endTime}`).setDate(new Date(`${startDate}T${endTime}`).getDate() + index * 7)).toISOString(),
      }
    )
  }
  return generated
}