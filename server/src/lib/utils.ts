export function verifyPassword(password: string): boolean {
  // The password must contain at least one lowercase letter, uppercase letter, number, special character, and be at least 8 characters long
  return !!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/);
}