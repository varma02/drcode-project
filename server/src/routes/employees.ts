import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import type { Employee } from '../database/models';
import errorHandler from '../lib/errorHandler';
import { BadRequestError, FieldsInvalidError, FieldsRequiredError } from '../lib/errors';

const employeesRouter = express.Router();

employeesRouter.use(ensureAuth);

employeesRouter.get('/all', ensureAdmin, errorHandler(async (req, res) => {
  const employees = (await db.query<Employee[][]>('SELECT * OMIT password, session_key FROM employee'))[0];

  res.status(200).json({
    code: "success",
    message: "All employees retrieved",
    data: { employees },
  });
}));

employeesRouter.get('/:id', errorHandler(async (req, res) => {
  if (!req.params.id)
    throw new FieldsRequiredError();
  if (!req.params.id.startsWith("employee:")) 
    throw new FieldsInvalidError();
  
  if (req.query.include && isAdmin(req)) {
    const include = new Set((req.query.include as string).trim().split(","));
    const dbResponse = (await db.query<{employee: Employee, unpaid_work: any, groups: any}[]>(`
      RETURN {
        employee: (SELECT * OMIT password, session_key FROM ONLY type::thing($employee)),
        ${include.has("unpaid_work") ?
        "unpaid_work: (SELECT ->worked_at[WHERE ! paid].* as _ FROM ONLY type::thing($employee) FETCH _.out)._," : ""}
        ${include.has("groups") ?
        "groups: (SELECT * FROM group WHERE type::thing($employee) IN teachers)," : ""}
      }`, { employee: req.params.id }))[0];
  
    if (!dbResponse.employee || !dbResponse.employee.name) 
      throw new BadRequestError();
  
    res.status(200).json({
      code: "success",
      message: "Employee data retrieved",
      data: {
        employee: dbResponse.employee,
        unpaid_work: dbResponse.unpaid_work,
        groups: dbResponse.groups,
      },
    });

  } else {
    const employee = (await db.query<Employee[]>(
      "SELECT * OMIT password, session_key FROM ONLY type::thing($employee)",
      { employee: req.params.id }))[0];
  
    if (!employee || !employee.name) 
      throw new BadRequestError();
  
    res.status(200).json({
      code: "success",
      message: "Employee data retrieved",
      data: { employee },
    });
  }
}));

employeesRouter.post('/remove', errorHandler(async (req, res) => {
  const { id } = req.body;
  if (!id)
    throw new FieldsRequiredError();
  if (!id.startsWith("employee:"))
    throw new FieldsInvalidError();

  const result = await db.query<Employee[]>("DELETE ONLY type::thing($employee) RETURN BEFORE;", { employee: id });

  if (result?.[0]?.email) 
    throw new BadRequestError();

  res.status(200).json({
    code: "success",
    message: "Employee deleted",
  });
}));

employeesRouter.post("/update", errorHandler(async (req, res) => {
  const { id, name, email, roles } = req.body;
  if (!id || (!name && !email && !roles)) 
    throw new FieldsRequiredError();

  if (!id.startsWith("employee:") || !Array.isArray(roles) || !roles.every(r => r === "administrator" || r === "teacher"))
    throw new FieldsInvalidError();

  const result = await db.query<Employee[]>(`
    UPDATE ONLY type::thing($employee) MERGE {
      ${name ? "name: $name ," : ""}
      ${email ? "email: $email ," : ""}
      ${roles ? "roles: $roles ," : ""}
    };`, { employee: id, name, email, roles });

  if (!result?.[0]?.email)
    throw new BadRequestError();

  res.status(200).json({
    code: "success",
    message: "Employee updated",
    data: {
      employee: result[0],
    }
  });
}));

export default employeesRouter;