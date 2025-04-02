import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const role_map = {
  "administrator" : "Adminisztrátor",
  "teacher" : "Oktató",
}

export function getTopRole(roles: string[] | Set<string>): string {
  roles = new Set(roles);
  if (roles.has("administrator")) return role_map.administrator;
  if (roles.has("teacher")) return role_map.teacher;
  return "Alkalmazott";
}

export function getMonogram(name: string): string {
  return name.split(" ").slice(0, 2).map(v => v[0]).join("");
}