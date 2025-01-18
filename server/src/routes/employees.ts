import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import type { Employee } from '../database/models';
import errorHandler from '../lib/errorHandler';
import { BadRequestError, FieldsInvalidError, FieldsRequiredError, NotFoundError } from '../lib/errors';

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

employeesRouter.get('/get', errorHandler(async (req, res) => {
  const ids = (req.query.ids as string).trim().split(",");
  if (ids.length === 0)
    throw new FieldsRequiredError();
  if (ids.every(id => !id.startsWith("employee:")))
    throw new FieldsInvalidError();

  const selection = [];
  selection.push("*");
  if (req.query.include) {
    const include = new Set((req.query.include as string).trim().split(","));
    if (include.has("unpaid_work")) selection.push("->worked_at[WHERE ! paid].* as unpaid_work");
    if (include.has("groups")) selection.push("(SELECT VALUE id FROM group WHERE type::thing($parent.id) IN teachers) as groups");
  }
  const employees = (await db.query<Employee[][]>(`
    SELECT ${selection.join(", ")} OMIT password, session_key FROM array::map($ids, |$id| type::thing($id));
  `, {ids}))[0];

  if (!employees || !employees.length)
    throw new NotFoundError();

  res.status(200).json({
    code: "success",
    message: "Employee(s) retrieved",
    data: { employees },
  });
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