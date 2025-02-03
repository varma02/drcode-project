import { beforeAll, describe, expect, test } from 'bun:test'
import request, { type Response } from 'supertest'
import { app } from '../src/index'

describe("Employee (/employee)", () => {
  let token = ""

  beforeAll(async (done) => {
    const authResponse = await request(app)
      .post('/auth/login')
      .send({
        email: "admin@example.com",
        password: "1234"
      })
    token = authResponse?.body?.data?.token
    done()
  })

  test("Get all employee", async () => {
    
    const response = await request(app)
      .get('/employee/all')
      .set('Authorization', `Bearer ${token}`)
    expect(response.headers["content-type"]).toMatch(/json/)
    expect(response.status).toEqual(200)
    expect(response.body.code).toEqual('success')
    expect(response.body.data).toBeObject()
    expect(response.body.data.employees).toBeArray()
  }, 100)

  test("Get employees by Id", async () => {
    const response = await request(app)
      .get('/employee/get')
      .set('Authorization', `Bearer ${token}`)
      .query({
        ids: "employee:12345,employee:54321"
      })
    expect(response.headers["content-type"]).toMatch(/json/)
    expect(response.status).toEqual(200)
    expect(response.body.code).toEqual('success')
    expect(response.body.data).toBeObject()
    expect(response.body.data.employees).toBeArrayOfSize(2)
    expect(response.body.data.employees[0]).toContainAllKeys(["created", "email", "id", "name", "notes", "roles"])
    expect(response.body.data.employees[0]).not.toContainAnyKeys(["password", "session_key"])

  }, 100)

  test("Update employee", async () => {
    const response = await request(app)
      .post('/employee/update')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: "employee:12345",
        name: "Népírtás",
        email: "asd@example.com",
        roles: ["teacher"],
      })
    expect(response.headers["content-type"]).toMatch(/json/)
    expect(response.status).toEqual(200)
    expect(response.body.code).toEqual('success')
    expect(response.body.data).toBeObject()
    
    expect(response.body.data.employee).toContainAllKeys(["created", "email", "id", "name", "notes", "roles"])
    expect(response.body.data.employee.name).toBe("Népírtás")
    expect(response.body.data.employee.email).toBe("asd@example.com")
    expect(response.body.data.employee.roles).toContainAllValues(["teacher"])
    expect(response.body.data.employee).not.toContainAnyKeys(["password", "session_key"])
  }, 100)

  test("Remove employees by Id", async () => {
    const response = await request(app)
      .post('/employee/remove')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ids: ["employee:12345","employee:54321"]
      })
    expect(response.headers["content-type"]).toMatch(/json/)
    expect(response.status).toEqual(200)
    expect(response.body.code).toEqual('success')
  }, 100)

})