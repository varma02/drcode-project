import { describe, expect, test } from 'bun:test';
import { verifyPassword } from '../src/lib/utils';

describe("Utils", () => {
  test("Password strength check", () => {
    expect(verifyPassword("password")).toBeFalse();
    expect(verifyPassword("1234")).toBeFalse();
    expect(verifyPassword("abc123")).toBeFalse();
    expect(verifyPassword("AsD123")).toBeFalse();
    expect(verifyPassword("AsD123#")).toBeFalse();
    expect(verifyPassword("AsD123#!")).toBeTrue();
  });
});